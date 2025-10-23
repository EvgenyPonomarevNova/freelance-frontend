// components/Chat/Chat.jsx
import './Chat.scss'
import { useState, useEffect, useRef } from 'react'
import { useUser } from '../../contexts/UserContext'

function Chat({ projectId, counterpart }) {
  const { user } = useUser()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [attachments, setAttachments] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  // Загружаем историю сообщений
  useEffect(() => {
    loadMessages()
    simulateOnlineStatus()
  }, [projectId])

  // Автопрокрутка к новым сообщениям
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const simulateOnlineStatus = () => {
    // Имитация онлайн статуса
    setIsOnline(Math.random() > 0.3)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadMessages = () => {
    if (!projectId || !user || !counterpart) return
    
    const chatKey = `chat_${projectId}_${user.id}_${counterpart.id}`
    const savedMessages = JSON.parse(localStorage.getItem(chatKey) || '[]')
    
    // Добавляем демо-сообщения если чат пустой
    if (savedMessages.length === 0) {
      const demoMessages = [
        {
          id: '1',
          text: 'Здравствуйте! Интересует ваш проект.',
          senderId: counterpart.id,
          senderName: counterpart.name,
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          isRead: true,
          type: 'text'
        },
        {
          id: '2',
          text: 'Привет! Расскажите подробнее о задаче.',
          senderId: user.id,
          senderName: user.profile?.name || 'Вы',
          timestamp: new Date(Date.now() - 3500000).toISOString(),
          isRead: true,
          type: 'text'
        },
        {
          id: '3',
          text: 'Нужно разработать лендинг для SaaS продукта. Есть ТЗ?',
          senderId: counterpart.id,
          senderName: counterpart.name,
          timestamp: new Date(Date.now() - 3400000).toISOString(),
          isRead: true,
          type: 'text'
        }
      ]
      localStorage.setItem(chatKey, JSON.stringify(demoMessages))
      setMessages(demoMessages)
    } else {
      setMessages(savedMessages)
    }
  }

  const handleTyping = () => {
    setIsTyping(true)
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
    }, 1000)
  }

  const sendMessage = async () => {
    if ((!newMessage.trim() && attachments.length === 0) || !projectId || !user || !counterpart) return

    setIsLoading(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const chatKey = `chat_${projectId}_${user.id}_${counterpart.id}`
      const savedMessages = JSON.parse(localStorage.getItem(chatKey) || '[]')
      
      const newMessages = []
      
      // Текстовое сообщение
      if (newMessage.trim()) {
        const textMessage = {
          id: Date.now().toString(),
          text: newMessage.trim(),
          senderId: user.id,
          senderName: user.profile?.name || 'Вы',
          timestamp: new Date().toISOString(),
          isRead: false,
          type: 'text'
        }
        newMessages.push(textMessage)
      }
      
      // Прикрепленные файлы
      attachments.forEach(file => {
        const fileMessage = {
          id: `file_${Date.now()}_${file.name}`,
          text: file.name,
          senderId: user.id,
          senderName: user.profile?.name || 'Вы',
          timestamp: new Date().toISOString(),
          isRead: false,
          type: 'file',
          file: {
            name: file.name,
            size: file.size,
            type: file.type,
            url: URL.createObjectURL(file)
          }
        }
        newMessages.push(fileMessage)
      })
      
      const updatedMessages = [...savedMessages, ...newMessages]
      localStorage.setItem(chatKey, JSON.stringify(updatedMessages))
      setMessages(updatedMessages)
      setNewMessage('')
      setAttachments([])
      setIsTyping(false)
      
      // Симуляция ответа
      simulateResponse()
      
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error)
      alert('Не удалось отправить сообщение')
    } finally {
      setIsLoading(false)
    }
  }

  const simulateResponse = () => {
    setTimeout(() => {
      const chatKey = `chat_${projectId}_${user.id}_${counterpart.id}`
      const savedMessages = JSON.parse(localStorage.getItem(chatKey) || '[]')
      
      const responseMessage = {
        id: `response_${Date.now()}`,
        text: 'Спасибо за информацию! Изучу и отвечу.',
        senderId: counterpart.id,
        senderName: counterpart.name,
        timestamp: new Date().toISOString(),
        isRead: false,
        type: 'text'
      }
      
      const updatedMessages = [...savedMessages, responseMessage]
      localStorage.setItem(chatKey, JSON.stringify(updatedMessages))
      setMessages(updatedMessages)
    }, 2000)
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    const validFiles = files.filter(file => {
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        alert(`Файл ${file.name} слишком большой. Максимальный размер: 10MB`)
        return false
      }
      return true
    })
    
    setAttachments(prev => [...prev, ...validFiles])
    e.target.value = '' // Сброс input
  }

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const formatDate = (timestamp) => {
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

  const getFileIcon = (fileType) => {
    if (fileType.includes('image')) return '🖼️'
    if (fileType.includes('pdf')) return '📄'
    if (fileType.includes('word')) return '📝'
    if (fileType.includes('excel')) return '📊'
    if (fileType.includes('zip')) return '📦'
    return '📎'
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const filteredMessages = messages.filter(message =>
    message.text.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const shouldShowDate = (message, index) => {
    if (index === 0) return true
    const prevMessage = messages[index - 1]
    const prevDate = new Date(prevMessage.timestamp).toDateString()
    const currentDate = new Date(message.timestamp).toDateString()
    return prevDate !== currentDate
  }

  if (!user || !counterpart) {
    return (
      <div className="chat-error">
        <p>Не удалось загрузить чат</p>
      </div>
    )
  }

  return (
    <div className="chat">
      {/* Заголовок чата */}
      <div className="chat-header">
        <div className="counterpart-info">
          <div className="avatar">
            {counterpart.name?.split(' ').map(n => n[0]).join('') || 'U'}
          </div>
          <div className="info">
            <h4>{counterpart.name}</h4>
            <div className="status">
              <span className={`status-dot ${isOnline ? 'online' : 'offline'}`}></span>
              {isOnline ? 'Online' : 'Offline'}
              {isTyping && <span className="typing-indicator">печатает...</span>}
            </div>
          </div>
        </div>
        
        <div className="chat-actions">
          <button 
            className={`action-btn ${showSearch ? 'active' : ''}`}
            onClick={() => setShowSearch(!showSearch)}
            title="Поиск сообщений"
          >
            🔍
          </button>
          <button className="action-btn" title="Информация о чате">
            ⓘ
          </button>
        </div>
      </div>

      {/* Поиск сообщений */}
      {showSearch && (
        <div className="search-container">
          <input
            type="text"
            placeholder="Поиск сообщений..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button 
              className="clear-search"
              onClick={() => setSearchTerm('')}
            >
              ✕
            </button>
          )}
          <div className="search-results">
            Найдено: {filteredMessages.length} сообщений
          </div>
        </div>
      )}

      {/* Область сообщений */}
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="no-messages">
            <div className="icon">💬</div>
            <p>Начните общение</p>
            <span>Напишите первое сообщение</span>
          </div>
        ) : (
          <div className="messages">
            {filteredMessages.map((message, index) => (
              <div key={message.id}>
                {/* Дата */}
                {shouldShowDate(message, index) && (
                  <div className="date-divider">
                    <span>{formatDate(message.timestamp)}</span>
                  </div>
                )}
                
                {/* Сообщение */}
                <div 
                  className={`message ${message.senderId === user.id ? 'own' : 'other'}`}
                >
                  {message.senderId !== user.id && (
                    <div className="message-avatar">
                      {message.senderName?.split(' ').map(n => n[0]).join('') || 'U'}
                    </div>
                  )}
                  
                  <div className="message-content">
                    {message.senderId !== user.id && (
                      <div className="sender-name">{message.senderName}</div>
                    )}
                    
                    {message.type === 'file' ? (
                      <div className="file-message">
                        <div className="file-info">
                          <span className="file-icon">
                            {getFileIcon(message.file?.type)}
                          </span>
                          <div className="file-details">
                            <div className="file-name">{message.text}</div>
                            <div className="file-size">
                              {formatFileSize(message.file?.size || 0)}
                            </div>
                          </div>
                        </div>
                        <a 
                          href={message.file?.url} 
                          download={message.file?.name}
                          className="download-btn"
                        >
                          📥
                        </a>
                      </div>
                    ) : (
                      <p>{message.text}</p>
                    )}
                    
                    <span className="time">{formatTime(message.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Прикрепленные файлы */}
      {attachments.length > 0 && (
        <div className="attachments-preview">
          <div className="attachments-header">
            <span>Прикрепленные файлы:</span>
            <button 
              onClick={() => setAttachments([])}
              className="clear-attachments"
            >
              Очистить все
            </button>
          </div>
          <div className="attachments-list">
            {attachments.map((file, index) => (
              <div key={index} className="attachment-item">
                <span className="file-icon">
                  {getFileIcon(file.type)}
                </span>
                <span className="file-name">{file.name}</span>
                <button 
                  onClick={() => removeAttachment(index)}
                  className="remove-attachment"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Поле ввода */}
      <div className="input-container">
        <div className="input-actions">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            multiple
            style={{ display: 'none' }}
          />
          <button 
            className="attachment-btn"
            onClick={() => fileInputRef.current?.click()}
            title="Прикрепить файл"
          >
            📎
          </button>
        </div>
        
        <div className="input-wrapper">
          <textarea
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value)
              handleTyping()
            }}
            onKeyPress={handleKeyPress}
            placeholder="Введите сообщение..."
            rows="1"
            disabled={isLoading}
          />
          
          <button 
            onClick={sendMessage}
            disabled={(!newMessage.trim() && attachments.length === 0) || isLoading}
            className="send-btn"
          >
            {isLoading ? '⏳' : '📨'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Chat