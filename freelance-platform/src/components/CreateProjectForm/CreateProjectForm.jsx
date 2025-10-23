import './CreateProjectForm.scss'
import { useState } from 'react'
import { useUser } from '../../contexts/UserContext'

function CreateProjectForm({ onSuccess, onCancel }) {
  const { user } = useUser()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'development',
    budget: '',
    deadline: '',
    skills: []
  })

  const [currentSkill, setCurrentSkill] = useState('')

  // Если пользователь не заказчик - показываем сообщение
  if (user?.role !== 'client') {
    return (
      <div className="not-client-message">
        <h2>Только для заказчиков</h2>
        <p>Для создания проектов необходимо быть зарегистрированным как заказчик</p>
        <button onClick={onCancel}>Вернуться назад</button>
      </div>
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Валидация
    if (!formData.title.trim() || !formData.description.trim() || !formData.budget) {
      alert('Пожалуйста, заполните обязательные поля')
      return
    }

    // Сохраняем проект в localStorage
    const projects = JSON.parse(localStorage.getItem('nexus_projects') || '[]')
    const newProject = {
      id: Date.now().toString(),
      ...formData,
      client: {
        id: user.id,
        name: user.profile.name,
        avatar: user.profile.avatar
      },
      createdAt: new Date().toISOString(),
      status: 'open',
      responses: [],
      views: 0
    }
    
    projects.unshift(newProject) // Добавляем в начало
    localStorage.setItem('nexus_projects', JSON.stringify(projects))
    
    // Очищаем форму
    setFormData({
      title: '',
      description: '',
      category: 'development',
      budget: '',
      deadline: '',
      skills: []
    })
    
    // Вызываем колбэк успеха
    onSuccess?.()
  }

  const addSkill = () => {
    if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, currentSkill.trim()]
      })
      setCurrentSkill('')
    }
  }

  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    })
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.target.name !== 'description') {
      e.preventDefault()
      if (e.target.name === 'skill') {
        addSkill()
      }
    }
  }

  return (
    <div className="create-project-form">
      <div className="form-header">
        <h2>Создать новый проект</h2>
        <p>Заполните информацию о вашем проекте</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Название проекта */}
        <div className="form-group">
          <label htmlFor="title">Название проекта *</label>
          <input 
            type="text" 
            id="title"
            name="title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="Например: Разработка лендинга для кофейни"
            required
          />
        </div>

        {/* Описание */}
        <div className="form-group">
          <label htmlFor="description">Подробное описание *</label>
          <textarea 
            id="description"
            name="description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Опишите задачу подробно:
• Цели проекта
• Требования к результату  
• Особенности и пожелания
• Критерии успеха"
            rows="6"
            required
          />
        </div>

        {/* Категория и бюджет в одной строке */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Категория *</label>
            <select 
              id="category"
              name="category"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="development">💻 Разработка</option>
              <option value="design">🎨 Дизайн</option>
              <option value="marketing">📊 Маркетинг</option>
              <option value="writing">📝 Тексты</option>
              <option value="seo">🔍 SEO</option>
              <option value="other">🔧 Другое</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="budget">Бюджет (₽) *</label>
            <input 
              type="number" 
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={(e) => setFormData({...formData, budget: e.target.value})}
              placeholder="5000"
              min="1000"
              required
            />
          </div>
        </div>

        {/* Срок выполнения */}
        <div className="form-group">
          <label htmlFor="deadline">Срок выполнения</label>
          <input 
            type="text" 
            id="deadline"
            name="deadline"
            value={formData.deadline}
            onChange={(e) => setFormData({...formData, deadline: e.target.value})}
            placeholder="Например: 7 дней, 2 недели, 1 месяц"
          />
        </div>

        {/* Навыки */}
        <div className="form-group">
          <label htmlFor="skill">Требуемые навыки</label>
          <div className="skills-input-container">
            <input 
              type="text" 
              id="skill"
              name="skill"
              value={currentSkill}
              onChange={(e) => setCurrentSkill(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Например: React, Figma, копирайтинг"
            />
            <button type="button" onClick={addSkill} className="add-skill-btn">
              +
            </button>
          </div>
          
          {/* Список добавленных навыков */}
          {formData.skills.length > 0 && (
            <div className="skills-list">
              {formData.skills.map(skill => (
                <span key={skill} className="skill-tag">
                  {skill}
                  <button 
                    type="button" 
                    onClick={() => removeSkill(skill)}
                    className="remove-skill"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Кнопки */}
        <div className="form-actions">
          <button type="button" onClick={onCancel} className="cancel-btn">
            Отмена
          </button>
          <button type="submit" className="submit-btn">
            🚀 Опубликовать проект
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateProjectForm