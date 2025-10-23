// pages/ChatPage/ChatPage.jsx
import './ChatPage.scss'
import { useParams } from 'react-router-dom'
import { useUser } from '../../contexts/UserContext'
import Chat from '../../components/Chat/Chat'

function ChatPage() {
  const { projectId } = useParams()
  const { user } = useUser()

  // Получаем информацию о чате
  const getChatInfo = () => {
    if (!projectId || !user) return null

    // Если это чат между пользователями (начинается с chat_)
    if (projectId.startsWith('chat_')) {
      const chats = JSON.parse(localStorage.getItem('user_chats') || '{}')
      const chat = chats[projectId]
      
      if (chat) {
        const counterpart = chat.participants.find(p => p.id !== user.id)
        return {
          counterpart: counterpart || { id: 'unknown', name: 'Пользователь' },
          projectTitle: `Чат с ${counterpart?.name || 'пользователем'}`
        }
      }
    }

    // Если это чат проекта
    const projects = JSON.parse(localStorage.getItem('nexus_projects') || '[]')
    const project = projects.find(p => p.id === projectId)
    
    if (project) {
      // Определяем собеседника
      let counterpart = null
      if (user.role === 'freelancer') {
        counterpart = project.client
      } else if (user.role === 'client') {
        // Находим фрилансера, который откликнулся на проект
        const userResponse = project.responses?.find(r => r.freelancer.id === user.id)
        if (userResponse) {
          counterpart = userResponse.freelancer
        }
      }
      
      return {
        counterpart: counterpart || { id: 'unknown', name: 'Участник проекта' },
        projectTitle: project.title
      }
    }

    return null
  }

  const chatInfo = getChatInfo()

  if (!user) {
    return (
      <div className="chat-page">
        <div className="not-authorized">
          <h3>Необходима авторизация</h3>
          <p>Для доступа к чату войдите в систему</p>
        </div>
      </div>
    )
  }

  if (!chatInfo) {
    return (
      <div className="chat-page">
        <div className="chat-not-found">
          <h3>Чат не найден</h3>
          <p>Возможно, у вас нет доступа к этому чату</p>
        </div>
      </div>
    )
  }

  return (
    <div className="chat-page">
      <div className="chat-container">
        <Chat 
          projectId={projectId}
          counterpart={chatInfo.counterpart}
        />
      </div>
    </div>
  )
}

export default ChatPage