import './Chat.scss'
import { useState, useEffect, useRef } from 'react'
import { useUser } from '../../contexts/UserContext'

function Chat({ projectId, counterpart }) {
  const { user } = useUser()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  // Загружаем историю сообщений
  useEffect(() => {
    loadMessages()
  }, [projectId])

  // Автопрокрутка к новым сообщениям
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadMessages = () => {
    if (!projectId || !user || !counterpart) return
    
    const chatKey = `chat_${projectId}_${user.id}_${counterpart.id}`
    const savedMessages = JSON.parse(localStorage.getItem(chatKey) || '[]')
    setMessages(savedMessages)
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !projectId || !user || !counterpart) return

    setIsLoading(true)

    try {
      // Имитируем задержку сети
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const chatKey = `chat_${projectId}_${user.id}_${counterpart.id}`
      const savedMessages = JSON.parse(localStorage.getItem(chatKey) || '[]')
      
      const message = {
        id: Date.now().toString(),
        text: newMessage.trim(),
        senderId: user.id,
        senderName: user.profile?.name || 'Пользователь',
        timestamp: new Date().toISOString(),
        isRead: false
      }
      
      const updatedMessages = [...savedMessages, message]
      localStorage.setItem(chatKey, JSON.stringify(updatedMessages))
      setMessages(updatedMessages)
      setNewMessage('')
      
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error)
      alert('Не удалось отправить сообщение')
    } finally {
      setIsLoading(false)
    }
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
            <span className="status">online</span>
          </div>
        </div>
      </div>

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
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`message ${message.senderId === user.id ? 'own' : 'other'}`}
              >
                <div className="message-content">
                  <p>{message.text}</p>
                  <span className="time">{formatTime(message.timestamp)}</span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Поле ввода */}
      <div className="input-container">
        <div className="input-wrapper">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Введите сообщение..."
            rows="1"
            disabled={isLoading}
          />
          <button 
            onClick={sendMessage}
            disabled={!newMessage.trim() || isLoading}
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