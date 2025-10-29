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

    // Ищем проект в localStorage
    const projects = JSON.parse(localStorage.getItem('nexus_projects') || '[]')
    const project = projects.find(p => p.id == projectId) // Используем == вместо === для сравнения чисел и строк
    
    if (project) {
      // Определяем собеседника
      let counterpart = null
      
      if (user.role === 'client') {
        // Если пользователь клиент, ищем фрилансера в responses
        const response = project.responses?.[0]
        if (response && response.freelancer) {
          counterpart = {
            id: response.freelancer.id,
            name: response.freelancer.profile?.name || 'Фрилансер',
            avatar: response.freelancer.profile?.avatar,
            title: response.freelancer.profile?.title
          }
        }
      } else if (user.role === 'freelancer') {
        // Если пользователь фрилансер, собеседник - клиент
        if (project.client) {
          counterpart = {
            id: project.client.id,
            name: project.client.profile?.name || 'Клиент',
            avatar: project.client.profile?.avatar,
            title: project.client.profile?.title
          }
        }
      }
      
      return {
        counterpart: counterpart || { 
          id: 'unknown', 
          name: 'Собеседник',
          avatar: '',
          title: ''
        },
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
          <p>Возможно, у вас нет доступа к этому чату или проект был удален</p>
          <button 
            onClick={() => window.history.back()} 
            className="btn btn-primary"
          >
            Вернуться назад
          </button>
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