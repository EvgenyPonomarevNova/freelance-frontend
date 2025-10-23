import './ProjectCard.scss'
import { useState } from 'react'
import { useUser } from '../../contexts/UserContext'
import RespondForm from '../RespondForm/RespondForm'

function ProjectCard({ project }) {
  const { user } = useUser()
  const [showRespondForm, setShowRespondForm] = useState(false)
  
  const hasResponded = user && project.responses?.some(r => r.freelancer.id === user.id)

const handleRespond = async () => {
  if (!user) {
    alert('Для отклика необходимо войти в систему')
    return
  }
  
  // Показываем форму отклика или сразу отправляем
  try {
    const response = await apiService.respondToProject(project._id, {
      proposal: "Готов взяться за проект!",
      price: project.budget * 0.8, // 80% от бюджета
      timeline: "2 недели"
    })
    
    alert('Отклик успешно отправлен!')
    setShowRespondForm(false)
  } catch (error) {
    alert('Ошибка при отправке отклика: ' + error.message)
  }
}

  const handleRespondSuccess = () => {
    setShowRespondForm(false)
    alert('Отклик успешно отправлен!')
  }

  const handleChatClick = () => {
    if (!user) {
      alert('Для общения в чате необходимо войти в систему')
      return
    }
    window.location.href = `/chat/${project.id}`
  }

  return (
    <>
      <div className="project-card">
        <div className="project-header">
          <h3 className="project-title">{project.title}</h3>
          <span className="project-budget">{project.budget} ₽</span>
        </div>
        
        <p className="project-description">{project.description}</p>
        
        <div className="project-meta">
          <span className="project-category">{getCategoryLabel(project.category)}</span>
          <span className="project-date">{formatDate(project.createdAt)}</span>
          <span className="project-responses">{project.responses?.length || 0} откликов</span>
        </div>

        {project.skills && project.skills.length > 0 && (
          <div className="project-skills">
            {project.skills.map(skill => (
              <span key={skill} className="skill-tag">{skill}</span>
            ))}
          </div>
        )}
        
        <div className="project-footer">
          <div className="project-client">
            <span className="client-avatar">
              {project.client?.name?.split(' ').map(n => n[0]).join('') || 'C'}
            </span>
            <span className="client-name">{project.client?.name || 'Заказчик'}</span>
          </div>
          
          <div className="project-actions">
            {/* Кнопка чата показывается если пользователь участник проекта */}
            {(user?.id === project.client?.id || hasResponded) && (
              <button 
                className="chat-btn"
                onClick={handleChatClick}
              >
                💬 Чат
              </button>
            )}
            
            {/* Кнопка отклика */}
            {hasResponded ? (
              <button className="responded-btn" disabled>
                ✅ Отклик отправлен
              </button>
            ) : (
              <button 
                className="respond-btn"
                onClick={handleRespond}
                disabled={user?.role !== 'freelancer'}
              >
                {user?.role === 'freelancer' ? 'Откликнуться' : 'Только для фрилансеров'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Модальное окно формы отклика */}
      {showRespondForm && (
        <div className="modal-overlay">
          <RespondForm 
            project={project}
            onClose={() => setShowRespondForm(false)}
            onSuccess={handleRespondSuccess}
          />
        </div>
      )}
    </>
  )
}

// Вспомогательные функции
function getCategoryLabel(category) {
  const categories = {
    development: '💻 Разработка',
    design: '🎨 Дизайн', 
    marketing: '📊 Маркетинг',
    writing: '📝 Тексты',
    seo: '🔍 SEO',
    other: '🔧 Другое'
  }
  return categories[category] || category
}

function formatDate(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Сегодня'
  if (diffDays === 1) return 'Вчера'
  if (diffDays < 7) return `${diffDays} дня назад`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} недели назад`
  return date.toLocaleDateString('ru-RU')
}

export default ProjectCard