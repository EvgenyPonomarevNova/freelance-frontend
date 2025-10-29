// components/ProjectCard/ProjectCard.jsx
import './ProjectCard.scss'
import { useState } from 'react'
import { useUser } from '../../contexts/UserContext'
import RespondForm from '../RespondForm/RespondForm'
import { apiService } from '../../services/api'

function ProjectCard({ project, onResponseSuccess }) {
  const { user } = useUser()
  const [showRespondForm, setShowRespondForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Защита от undefined и правильная проверка отклика
  const hasResponded = user && Array.isArray(project.responses) && 
    project.responses.some(response => 
      response && response.freelancer_id === user.id
    )

  // Защита от отсутствия проекта
  if (!project) {
    return (
      <div className="project-card error">
        <div className="project-header">
          <h3 className="project-title">Проект не загружен</h3>
        </div>
      </div>
    )
  }

  const handleRespond = async () => {
    if (!user) {
      alert('Для отклика необходимо войти в систему')
      return
    }
    
    if (user.role !== 'freelancer') {
      alert('Только фрилансеры могут откликаться на проекты')
      return
    }

    // Показываем форму отклика вместо автоматической отправки
    setShowRespondForm(true)
  }

  const handleQuickRespond = async () => {
    if (!user) {
      alert('Для отклика необходимо войти в систему')
      return
    }
    
    if (user.role !== 'freelancer') {
      alert('Только фрилансеры могут откликаться на проекты')
      return
    }

    setIsSubmitting(true)
    
    try {
      const projectId = project.id
      
      const response = await apiService.respondToProject(projectId, {
        proposal: "Готов взяться за проект! Ознакомился с требованиями и уверен, что смогу качественно выполнить работу в указанные сроки.",
        price: Math.round(project.budget * 0.8),
        timeline: "2 недели"
      })
      
      alert('Отклик успешно отправлен!')
      
      // Обновляем данные если есть callback
      if (onResponseSuccess) {
        onResponseSuccess()
      } else {
        // Иначе перезагружаем страницу
        window.location.reload()
      }
      
    } catch (error) {
      if (error.message.includes('400') && error.message.includes('уже отправили')) {
        alert('Вы уже отправили отклик на этот проект')
      } else if (error.message.includes('403')) {
        alert('Только фрилансеры могут откликаться на проекты')
      } else {
        alert('Ошибка при отправке отклика: ' + error.message)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRespondSuccess = () => {
    setShowRespondForm(false)
    alert('Отклик успешно отправлен!')
    
    // Обновляем данные если есть callback
    if (onResponseSuccess) {
      onResponseSuccess()
    } else {
      window.location.reload()
    }
  }

  const handleChatClick = () => {
    if (!user) {
      alert('Для общения в чате необходимо войти в систему')
      return
    }
    
    // Проверяем что пользователь участник проекта (клиент или откликнувшийся фрилансер)
    const isParticipant = user.id === project.client_id || hasResponded
    
    if (!isParticipant) {
      alert('Чат доступен только участникам проекта')
      return
    }
    
    window.location.href = `/chat/${project.id}`
  }

  // Получаем информацию о клиенте
  const clientName = project.client?.profile?.name || 
                    project.client?.name || 
                    'Заказчик'
  
  const clientAvatar = project.client?.profile?.name?.split(' ').map(n => n[0]).join('') || 
                      project.client?.name?.split(' ').map(n => n[0]).join('') || 
                      'C'

  return (
    <>
      <div className="project-card">
        <div className="project-header">
          <h3 className="project-title">{project.title || 'Без названия'}</h3>
          <span className="project-budget">{project.budget?.toLocaleString() || '0'} ₽</span>
        </div>
        
        <p className="project-description">
          {project.description || 'Описание отсутствует'}
        </p>
        
        <div className="project-meta">
          <span className="project-category">{getCategoryLabel(project.category)}</span>
          <span className="project-date">{formatDate(project.createdAt || project.created_at)}</span>
          <span className="project-responses">
            {(project.responses && Array.isArray(project.responses) ? project.responses.length : 0)} откликов
          </span>
        </div>

        {project.skills && project.skills.length > 0 && (
          <div className="project-skills">
            {project.skills.map((skill, index) => (
              <span key={skill + '-' + index} className="skill-tag">
                {typeof skill === 'string' ? skill : skill.skill || 'Навык'}
              </span>
            ))}
          </div>
        )}
        
        <div className="project-footer">
          <div className="project-client">
            <span className="client-avatar">
              {clientAvatar}
            </span>
            <span className="client-name">{clientName}</span>
            {project.client?.profile?.rating && (
              <span className="client-rating">⭐ {project.client.profile.rating}</span>
            )}
          </div>
          
          <div className="project-actions">
            {/* Кнопка чата показывается если пользователь участник проекта */}
            {(user?.id === project.client_id || hasResponded) && (
              <button 
                className="chat-btn"
                onClick={handleChatClick}
                disabled={isSubmitting}
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
                className={`respond-btn ${isSubmitting ? 'loading' : ''}`}
                onClick={handleQuickRespond}
                disabled={isSubmitting || user?.role !== 'freelancer'}
              >
                {isSubmitting ? 'Отправка...' : 
                 user?.role === 'freelancer' ? '🚀 Быстрый отклик' : 'Только для фрилансеров'}
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
  return categories[category] || category || '🔧 Другое'
}

function formatDate(dateString) {
  if (!dateString) return 'Недавно'
  
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Недавно'
    
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Сегодня'
    if (diffDays === 1) return 'Вчера'
    if (diffDays < 7) return `${diffDays} дня назад`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} недели назад`
    
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  } catch (error) {
    return 'Недавно'
  }
}

export default ProjectCard