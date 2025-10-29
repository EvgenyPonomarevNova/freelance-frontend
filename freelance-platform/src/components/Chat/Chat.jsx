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
  const textareaRef = useRef(null)

  // Загружаем историю сообщений
  useEffect(() => {
    loadMessages()
    simulateOnlineStatus()
  }, [projectId])

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

  const simulateOnlineStatus = () => {
    setIsOnline(Math.random() > 0.3)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadMessages = () => {
    if (!projectId || !user || !counterpart) return
    
    const chatKey = `chat_${projectId}_${user.id}_${counterpart.id}`
    const savedMessages = JSON.parse(localStorage.getItem(chatKey) || '[]')
    
    // Добавляем только одно приветственное сообщение если чат пустой
    if (savedMessages.length === 0) {
      const welcomeMessage = {
        id: '1',
        text: `Здравствуйте! Рад начать работу с вами над проектом.`,
        senderId: counterpart.id,
        senderName: counterpart.name,
        timestamp: new Date().toISOString(),
        isRead: true,
        type: 'text'
      }
      const updatedMessages = [welcomeMessage]
      localStorage.setItem(chatKey, JSON.stringify(updatedMessages))
      setMessages(updatedMessages)
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
      
      // Сброс высоты textarea
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
      
      // Симуляция ответа
      simulateResponse()
      
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error)
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
        text: 'Спасибо за сообщение!',
        senderId: counterpart.id,
        senderName: counterpart.name,
        timestamp: new Date().toISOString(),
        isRead: false,
        type: 'text'
      }
      
      const updatedMessages = [...savedMessages, responseMessage]
      localStorage.setItem(chatKey, JSON.stringify(updatedMessages))
      setMessages(updatedMessages)
    }, 2000 + Math.random() * 2000)
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
            {counterpart.avatar || counterpart.name?.split(' ').map(n => n[0]).join('') || 'U'}
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="action-btn" title="Информация о чате">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="8" r="1" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Поиск сообщений */}
      {showSearch && (
        <div className="search-container">
          <div className="search-input-wrapper">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="search-icon">
              <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
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
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
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
                          title="Скачать файл"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </a>
                      </div>
                    ) : (
                      <div className="text-message">
                        <p>{message.text}</p>
                      </div>
                    )}
                    
                    <div className="message-meta">
                      <span className="time">{formatTime(message.timestamp)}</span>
                      {message.senderId === user.id && (
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

      {/* Прикрепленные файлы */}
      {attachments.length > 0 && (
        <div className="attachments-preview">
          <div className="attachments-header">
            <span>Прикрепленные файлы ({attachments.length})</span>
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
                <span className="file-name" title={file.name}>
                  {file.name.length > 25 ? file.name.substring(0, 25) + '...' : file.name}
                </span>
                <span className="file-size">{formatFileSize(file.size)}</span>
                <button 
                  onClick={() => removeAttachment(index)}
                  className="remove-attachment"
                  title="Удалить файл"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M21.44 11.05L12.25 20.24C11.1242 21.3658 9.59723 21.9983 8.005 21.9983C6.41277 21.9983 4.8858 21.3658 3.76 20.24C2.6342 19.1142 2.00167 17.5872 2.00167 15.995C2.00167 14.4028 2.6342 12.8758 3.76 11.75L12.33 3.18C13.0847 2.42533 14.0588 1.99753 15.085 1.99753C16.1112 1.99753 17.0853 2.42533 17.84 3.18C18.5947 3.93467 19.0225 4.9088 19.0225 5.935C19.0225 6.9612 18.5947 7.93533 17.84 8.69L9.83 16.69C9.47778 17.0422 8.98417 17.2225 8.47 17.2225C7.95583 17.2225 7.46222 17.0422 7.11 16.69C6.75778 16.3378 6.5775 15.8442 6.5775 15.33C6.5775 14.8158 6.75778 14.3222 7.11 13.97L14.15 6.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
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
            disabled={isLoading}
            className="message-input"
          />
          
          <button 
            onClick={sendMessage}
            disabled={(!newMessage.trim() && attachments.length === 0) || isLoading}
            className={`send-btn ${isLoading ? 'loading' : ''}`}
            title="Отправить сообщение"
          >
            {isLoading ? (
              <div className="loading-spinner"></div>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Chat