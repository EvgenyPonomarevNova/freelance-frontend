// pages/ChatsPage/ChatsPage.jsx
import './ChatsPage.scss'
import { useState, useEffect } from 'react'
import { useUser } from '../../contexts/UserContext'
import { Link } from 'react-router-dom'

function ChatsPage() {
  const { user } = useUser()
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeChat, setActiveChat] = useState(null)
  const [activeChatMessages, setActiveChatMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')

  useEffect(() => {
    loadChats()
  }, [user])

  const loadChats = () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      // Загружаем проекты из localStorage
      const projects = JSON.parse(localStorage.getItem('nexus_projects') || '[]')
      
      // Собираем уникальные чаты по собеседникам
      const chatMap = new Map()

      projects.forEach(project => {
        // Проверяем, является ли пользователь участником проекта
        const isParticipant = 
          project.client_id === user.id ||
          project.responses?.some(response => response.freelancer_id === user.id)

        if (!isParticipant) return

        // Определяем собеседника
        let counterpart = null
        if (user.role === 'client') {
          const response = project.responses?.[0]
          if (response && response.freelancer) {
            counterpart = {
              id: response.freelancer.id,
              name: response.freelancer.profile?.name || 'Фрилансер',
              avatar: response.freelancer.profile?.avatar,
              title: response.freelancer.profile?.title,
              online: response.freelancer.profile?.online || false
            }
          }
        } else if (user.role === 'freelancer') {
          if (project.client) {
            counterpart = {
              id: project.client.id,
              name: project.client.profile?.name || 'Клиент',
              avatar: project.client.profile?.avatar,
              title: project.client.profile?.title,
              online: project.client.profile?.online || false
            }
          }
        }

        if (!counterpart) return

        // Создаем ключ для уникального чата
        const chatKey = `${user.id}_${counterpart.id}`
        
        // Загружаем сообщения для этого чата
        const messageKey = `chat_${project.id}_${user.id}_${counterpart.id}`
        const messages = JSON.parse(localStorage.getItem(messageKey) || '[]')
        
        const lastMessage = messages[messages.length - 1]
        const unreadCount = messages.filter(msg => 
          !msg.isRead && msg.senderId !== user.id
        ).length

        // Обновляем или создаем чат
        if (chatMap.has(chatKey)) {
          const existingChat = chatMap.get(chatKey)
          // Объединяем сообщения и выбираем последнее
          const allMessages = [...existingChat.messages, ...messages]
          const latestMessage = allMessages[allMessages.length - 1]
          
          chatMap.set(chatKey, {
            ...existingChat,
            messages: allMessages,
            lastMessage: latestMessage,
            unreadCount: existingChat.unreadCount + unreadCount,
            projects: [...existingChat.projects, project]
          })
        } else {
          chatMap.set(chatKey, {
            id: chatKey,
            counterpart,
            messages,
            lastMessage,
            unreadCount,
            projects: [project],
            updatedAt: lastMessage?.timestamp || project.updated_at || project.created_at
          })
        }
      })

      const uniqueChats = Array.from(chatMap.values())
      
      // Сортируем по дате последнего сообщения
      uniqueChats.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      
      setChats(uniqueChats)
    } catch (error) {
      console.error('Ошибка загрузки чатов:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChatSelect = (chat) => {
    setActiveChat(chat)
    setActiveChatMessages(chat.messages)
    
    // Помечаем сообщения как прочитанные
    if (chat.unreadCount > 0) {
      const updatedChats = chats.map(c => {
        if (c.id === chat.id) {
          const updatedMessages = c.messages.map(msg => ({
            ...msg,
            isRead: true
          }))
          return { ...c, messages: updatedMessages, unreadCount: 0 }
        }
        return c
      })
      setChats(updatedChats)
      
      // Обновляем в localStorage
      chat.projects.forEach(project => {
        const messageKey = `chat_${project.id}_${user.id}_${chat.counterpart.id}`
        const messages = JSON.parse(localStorage.getItem(messageKey) || '[]')
        const updatedMessages = messages.map(msg => ({
          ...msg,
          isRead: true
        }))
        localStorage.setItem(messageKey, JSON.stringify(updatedMessages))
      })
    }
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeChat) return

    const message = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      senderId: user.id,
      senderName: user.profile?.name || 'Вы',
      timestamp: new Date().toISOString(),
      isRead: false,
      type: 'text'
    }

    // Сохраняем сообщение во все связанные проекты
    activeChat.projects.forEach(project => {
      const messageKey = `chat_${project.id}_${user.id}_${activeChat.counterpart.id}`
      const messages = JSON.parse(localStorage.getItem(messageKey) || '[]')
      messages.push(message)
      localStorage.setItem(messageKey, JSON.stringify(messages))
    })

    // Обновляем состояние
    setNewMessage('')
    setActiveChatMessages(prev => [...prev, message])
    
    // Обновляем список чатов
    const updatedChats = chats.map(chat => {
      if (chat.id === activeChat.id) {
        const updatedMessages = [...chat.messages, message]
        return {
          ...chat,
          messages: updatedMessages,
          lastMessage: message,
          updatedAt: message.timestamp
        }
      }
      return chat
    })
    setChats(updatedChats)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (date.toDateString() === today.toDateString()) {
      return 'Сегодня'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Вчера'
    } else {
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long'
      })
    }
  }

  if (!user) {
    return (
      <div className="chats-page">
        <div className="not-authorized">
          <h3>Необходима авторизация</h3>
          <p>Для просмотра чатов войдите в систему</p>
          <Link to="/login" className="btn btn-primary">Войти</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="chats-page">
      <div className="chats-container">
        <div className="chats-header">
          <h1>💬 Сообщения</h1>
        </div>

        <div className="chats-layout">
          {/* Список чатов */}
          <div className="chats-sidebar">
            <div className="chats-list">
              {loading ? (
                <div className="loading">Загрузка чатов...</div>
              ) : chats.length === 0 ? (
                <div className="no-chats">
                  <div className="icon">💬</div>
                  <p>Нет активных чатов</p>
                </div>
              ) : (
                chats.map(chat => (
                  <div
                    key={chat.id}
                    className={`chat-item ${activeChat?.id === chat.id ? 'active' : ''}`}
                    onClick={() => handleChatSelect(chat)}
                  >
                    <div className="chat-avatar">
                      {chat.counterpart.avatar ? (
                        <img src={chat.counterpart.avatar} alt={chat.counterpart.name} />
                      ) : (
                        <div className="avatar-placeholder">
                          {chat.counterpart.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      )}
                      <span className={`online-status ${chat.counterpart.online ? 'online' : 'offline'}`}></span>
                    </div>
                    
                    <div className="chat-info">
                      <div className="chat-main">
                        <h4 className="chat-name">{chat.counterpart.name}</h4>
                        {chat.lastMessage && (
                          <p className="last-message">
                            {chat.lastMessage.isMyMessage && 'Вы: '}
                            {chat.lastMessage.text}
                          </p>
                        )}
                      </div>
                      
                      <div className="chat-meta">
                        {chat.lastMessage && (
                          <span className="message-time">
                            {formatTime(chat.lastMessage.timestamp)}
                          </span>
                        )}
                        {chat.unreadCount > 0 && (
                          <span className="unread-count">{chat.unreadCount}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Область сообщений */}
          <div className="messages-area">
            {activeChat ? (
              <>
                <div className="chat-header">
                  <div className="user-info">
                    <div className="avatar">
                      {activeChat.counterpart.avatar ? (
                        <img src={activeChat.counterpart.avatar} alt={activeChat.counterpart.name} />
                      ) : (
                        <div className="avatar-placeholder">
                          {activeChat.counterpart.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      )}
                      <span className={`online-dot ${activeChat.counterpart.online ? 'online' : 'offline'}`}></span>
                    </div>
                    <div className="user-details">
                      <h3>{activeChat.counterpart.name}</h3>
                      <p className="user-status">
                        {activeChat.counterpart.online ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="messages-container">
                  {activeChatMessages.length === 0 ? (
                    <div className="no-messages">
                      <div className="icon">💬</div>
                      <p>Нет сообщений</p>
                      <span>Начните общение первым</span>
                    </div>
                  ) : (
                    <div className="messages">
                      {activeChatMessages.map((message, index) => {
                        const showDate = index === 0 || 
                          formatDate(message.timestamp) !== formatDate(activeChatMessages[index - 1].timestamp)
                        
                        return (
                          <div key={message.id}>
                            {showDate && (
                              <div className="date-divider">
                                {formatDate(message.timestamp)}
                              </div>
                            )}
                            <div className={`message ${message.senderId === user.id ? 'outgoing' : 'incoming'}`}>
                              <div className="message-content">
                                <p>{message.text}</p>
                                <div className="message-time">
                                  {formatTime(message.timestamp)}
                                  {message.senderId === user.id && (
                                    <span className="read-status">
                                      {message.isRead ? '✓✓' : '✓'}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                <div className="message-input">
                  <div className="input-container">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Введите сообщение..."
                      className="message-input-field"
                    />
                    <button 
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="send-button"
                    >
                      Отправить
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="no-chat-selected">
                <div className="icon">💬</div>
                <h3>Выберите чат</h3>
                <p>Выберите диалог из списка чтобы начать общение</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatsPage