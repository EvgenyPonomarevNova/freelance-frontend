import './RespondForm.scss'
import { useState } from 'react'
import { useUser } from '../../contexts/UserContext'

function RespondForm({ project, onClose, onSuccess }) {
  const { user } = useUser()
  const [formData, setFormData] = useState({
    proposal: '',
    price: '',
    timeline: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Если пользователь не фрилансер
  if (user?.role !== 'freelancer') {
    return (
      <div className="not-freelancer-message">
        <h3>Только для фрилансеров</h3>
        <p>Откликаться на проекты могут только зарегистрированные фрилансеры</p>
        <button onClick={onClose} className="close-btn">Закрыть</button>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.proposal.trim() || !formData.price) {
      alert('Заполните обязательные поля')
      return
    }

    setIsSubmitting(true)

    try {
      // Имитируем задержку
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Сохраняем отклик
      const projects = JSON.parse(localStorage.getItem('nexus_projects') || '[]')
      const projectIndex = projects.findIndex(p => p.id === project.id)
      
      if (projectIndex !== -1) {
        const newResponse = {
          id: Date.now().toString(),
          freelancer: {
            id: user.id,
            name: user.profile.name,
            avatar: user.profile.avatar,
            rating: user.profile.rating
          },
          proposal: formData.proposal,
          price: parseInt(formData.price),
          timeline: formData.timeline,
          createdAt: new Date().toISOString(),
          status: 'pending' // pending, accepted, rejected
        }
        
        projects[projectIndex].responses.push(newResponse)
        localStorage.setItem('nexus_projects', JSON.stringify(projects))
        
        onSuccess?.()
        onClose?.()
      }
    } catch (error) {
      console.error('Ошибка при отправке отклика:', error)
      alert('Произошла ошибка при отправке отклика')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="respond-form">
      <div className="form-header">
        <h3>Откликнуться на проект</h3>
        <p>{project.title}</p>
        <button onClick={onClose} className="close-btn">×</button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="proposal">Ваше предложение *</label>
          <textarea
            id="proposal"
            name="proposal"
            value={formData.proposal}
            onChange={handleChange}
            placeholder="Расскажите почему вы подходите для этого проекта, опишите ваш подход и опыт..."
            rows="5"
            required
          />
          <div className="hint">Чем подробнее опишете ваш подход, тем выше шансы</div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">Ваша цена (₽) *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="5000"
              min="100"
              required
            />
            <div className="hint">Бюджет проекта: {project.budget} ₽</div>
          </div>

          <div className="form-group">
            <label htmlFor="timeline">Срок выполнения</label>
            <input
              type="text"
              id="timeline"
              name="timeline"
              value={formData.timeline}
              onChange={handleChange}
              placeholder="Например: 7 дней"
            />
            <div className="hint">Укажите когда сможете выполнить</div>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={onClose}
            className="cancel-btn"
            disabled={isSubmitting}
          >
            Отмена
          </button>
          <button 
            type="submit" 
            className={`submit-btn ${isSubmitting ? 'loading' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Отправка...' : '📨 Отправить отклик'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default RespondForm