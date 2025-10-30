// components/Chat/Chat.jsx
import './Chat.scss'
import { useState, useEffect, useRef } from 'react'
import { useUser } from '../../contexts/UserContext'

function Chat({ projectId, counterpart, chatId: propChatId }) {
  const { user } = useUser()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [attachments, setAttachments] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [currentChatId, setCurrentChatId] = useState(propChatId)
  
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const typingTimeoutRef = useRef(null)
  const textareaRef = useRef(null)

  // Создаем или получаем чат
  useEffect(() => {
    if (projectId && counterpart && user) {
      initializeChat()
    }
  }, [projectId, counterpart, user])

  // Загружаем сообщения когда есть chatId
  useEffect(() => {
    if (currentChatId) {
      loadMessages()
    }
  }, [currentChatId])

  // Автопрокрутка к новым сообщениям
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Автоматическое изменение высоты textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px'
    }
  }, [newMessage])

  const initializeChat = async () => {
    try {
      const response = await fetch('/api/chats/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          projectId,
          freelancerId: counterpart.id
        })
      })

      const result = await response.json()
      
      if (result.status === 'success') {
        setCurrentChatId(result.chat.id)
      }
    } catch (error) {
      console.error('Error creating chat:', error)
    }
  }

  const loadMessages = async () => {
    if (!currentChatId) return
    
    try {
      const response = await fetch(`/api/chats/${currentChatId}/messages`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      const result = await response.json()
      
      if (result.status === 'success') {
        setMessages(result.messages)
      }
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  const simulateOnlineStatus = () => {
    setIsOnline(Math.random() > 0.3)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
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
    if ((!newMessage.trim() && attachments.length === 0) || !currentChatId) return

    setIsLoading(true)

    try {
      // Отправляем текстовое сообщение
      if (newMessage.trim()) {
        const response = await fetch(`/api/chats/${currentChatId}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            text: newMessage.trim(),
            type: 'text'
          })
        })

        const result = await response.json()
        
        if (result.status === 'success') {
          setMessages(prev => [...prev, result.message])
          setNewMessage('')
          setIsTyping(false)
        }
      }
      
      // Сброс высоты textarea
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
      
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error)
    } finally {
      setIsLoading(false)
    }
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
    e.target.value = ''
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
    if (fileType?.includes('image')) return '🖼️'
    if (fileType?.includes('pdf')) return '📄'
    if (fileType?.includes('word')) return '📝'
    if (fileType?.includes('excel')) return '📊'
    if (fileType?.includes('zip')) return '📦'
    return '📎'
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes'
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
    const prevDate = new Date(prevMessage.created_at).toDateString()
    const currentDate = new Date(message.created_at).toDateString()
    return prevDate !== currentDate
  }

  if (!user || !counterpart) {
    return (
      <div className="chat-error">
        <div className="error-icon">⚠️</div>
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
            {counterpart.profile?.avatar || counterpart.profile?.name?.split(' ').map(n => n[0]).join('') || 'U'}
          </div>
          <div className="info">
            <h4>{counterpart.profile?.name || counterpart.name}</h4>
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
        </div>
      </div>

      {/* Поиск сообщений */}
      {showSearch && (
        <div className="search-container">
          <div className="search-input-wrapper">
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
          </div>
        </div>
      )}

      {/* Область сообщений */}
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="no-messages">
            <div className="icon">💬</div>
            <h3>Нет сообщений</h3>
            <p>Начните общение первым!</p>
          </div>
        ) : (
          <div className="messages">
            {filteredMessages.map((message, index) => (
              <div key={message.id}>
                {/* Дата */}
                {shouldShowDate(message, index) && (
                  <div className="date-divider">
                    <span>{formatDate(message.created_at)}</span>
                  </div>
                )}
                
                {/* Сообщение */}
                <div 
                  className={`message ${message.sender.id === user.id ? 'own' : 'other'}`}
                >
                  {message.sender.id !== user.id && (
                    <div className="message-avatar">
                      {message.sender.profile?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                    </div>
                  )}
                  
                  <div className="message-content">
                    {message.sender.id !== user.id && (
                      <div className="sender-name">{message.sender.profile?.name}</div>
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
                              {formatFileSize(message.file?.size)}
                            </div>
                          </div>
                        </div>
                        <a 
                          href={message.file?.url} 
                          download={message.file?.name}
                          className="download-btn"
                          title="Скачать файл"
                        >
                          📥
                        </a>
                      </div>
                    ) : (
                      <div className="text-message">
                        <p>{message.text}</p>
                      </div>
                    )}
                    
                    <div className="message-meta">
                      <span className="time">{formatTime(message.created_at)}</span>
                      {message.sender.id === user.id && (
                        <span className="read-status">
                          {message.isRead ? '✓✓' : '✓'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

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
            ref={textareaRef}
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value)
              handleTyping()
            }}
            onKeyPress={handleKeyPress}
            placeholder="Введите сообщение..."
            rows="1"
            disabled={isLoading || !currentChatId}
            className="message-input"
          />
          
          <button 
            onClick={sendMessage}
            disabled={(!newMessage.trim() && attachments.length === 0) || isLoading || !currentChatId}
            className={`send-btn ${isLoading ? 'loading' : ''}`}
            title="Отправить сообщение"
          >
            {isLoading ? '⏳' : '➤'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Chat