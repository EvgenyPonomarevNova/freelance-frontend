// components/ChatList/ChatList.jsx
import './ChatList.scss'
import { useState, useEffect } from 'react'
import { useUser } from '../../contexts/UserContext'

function ChatList({ onSelectChat, selectedChatId }) {
  const { user } = useUser()
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadChats()
  }, [user])

  const loadChats = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      const response = await fetch('/api/chats/my', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      const result = await response.json()
      
      if (result.status === 'success') {
        setChats(result.chats)
      }
    } catch (error) {
      console.error('Error loading chats:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCounterpart = (chat) => {
    return user.id === chat.clientId ? chat.freelancer : chat.client
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const getUnreadCount = (chat) => {
    return user.id === chat.clientId ? 
      chat.unreadCountClient : chat.unreadCountFreelancer
  }

  const filteredChats = chats.filter(chat => {
    const counterpart = getCounterpart(chat)
    const projectTitle = chat.Project?.title || ''
    const counterpartName = counterpart?.profile?.name || ''
    
    return counterpartName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           projectTitle.toLowerCase().includes(searchTerm.toLowerCase())
  })

  if (loading) {
    return (
      <div className="chat-list">
        <div className="loading-chats">
          <div className="loading-spinner"></div>
          <p>Загрузка чатов...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="chat-list">
      <div className="chat-list-header">
        <h3>💬 Мои чаты</h3>
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Поиск чатов..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="chats-container">
        {filteredChats.length === 0 ? (
          <div className="no-chats">
            <div className="icon">💬</div>
            <p>Нет активных чатов</p>
            <small>Начните общение в проектах</small>
          </div>
        ) : (
          filteredChats.map(chat => {
            const counterpart = getCounterpart(chat)
            const unreadCount = getUnreadCount(chat)
            const isSelected = selectedChatId === chat.id

            return (
              <div
                key={chat.id}
                className={`chat-item ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelectChat(chat)}
              >
                <div className="chat-avatar">
                  {counterpart?.profile?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                </div>
                
                <div className="chat-info">
                  <div className="chat-header">
                    <span className="chat-name">
                      {counterpart?.profile?.name || 'Пользователь'}
                    </span>
                    <span className="chat-time">
                      {formatTime(chat.lastMessageAt)}
                    </span>
                  </div>
                  
                  <div className="chat-preview">
                    <span className="project-title">
                      {chat.Project?.title || 'Проект'}
                    </span>
                    <span className="last-message">
                      {chat.lastMessage || 'Нет сообщений'}
                    </span>
                  </div>
                </div>

                {unreadCount > 0 && (
                  <div className="unread-badge">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default ChatList