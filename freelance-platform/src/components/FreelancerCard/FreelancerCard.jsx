// components/FreelancerCard/FreelancerCard.jsx
import './FreelancerCard.scss'
import { useState } from 'react'
import { useUser } from '../../contexts/UserContext'
import { useNavigate } from 'react-router-dom'
import { apiService } from '../../services/api'

function FreelancerCard({ freelancer }) {
  const { user } = useUser()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  
  const profile = freelancer.profile || {}
  const skills = profile.skills || []

  const handleMessageClick = async () => {
    if (!user) {
      alert('Пожалуйста, войдите в систему для отправки сообщений')
      navigate('/auth')
      return
    }

    setIsLoading(true)
    
    try {
      // Создаем проект для чата
      const projectData = {
        title: `Обсуждение с ${profile.name}`,
        description: `Чат с ${profile.name} - ${profile.title || 'Фрилансер'}`,
        budget: 1000,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        category: 'other',
        skills: skills.slice(0, 3)
      }

      const response = await apiService.createProject(projectData)
      
      if (response.project && response.project.id) {
        // Сохраняем проект в localStorage для ChatPage
        const existingProjects = JSON.parse(localStorage.getItem('nexus_projects') || '[]')
        const projectWithCounterpart = {
          ...response.project,
          client: user,
          responses: [{
            id: Date.now(),
            freelancer_id: freelancer.id,
            freelancer: {
              id: freelancer.id,
              profile: profile
            },
            status: 'pending',
            created_at: new Date().toISOString()
          }]
        }
        
        existingProjects.push(projectWithCounterpart)
        localStorage.setItem('nexus_projects', JSON.stringify(existingProjects))
        
        // Переходим в чат
        navigate(`/chat/${response.project.id}`)
      } else {
        throw new Error('Не удалось создать проект для чата')
      }
      
    } catch (error) {
      console.error('Ошибка при создании чата:', error)
      
      // Fallback: создаем демо-чат в localStorage
      const demoProjectId = `demo_${Date.now()}`
      
      // Сохраняем демо-проект в localStorage
      const existingProjects = JSON.parse(localStorage.getItem('nexus_projects') || '[]')
      const demoProject = {
        id: demoProjectId,
        title: `Обсуждение с ${profile.name}`,
        description: `Чат с ${profile.name}`,
        budget: 1000,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        category: 'other',
        skills: skills.slice(0, 3),
        client_id: user.id,
        client: user,
        responses: [{
          id: Date.now(),
          freelancer_id: freelancer.id,
          freelancer: {
            id: freelancer.id,
            profile: profile
          },
          status: 'pending',
          created_at: new Date().toISOString()
        }],
        status: 'open',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      existingProjects.push(demoProject)
      localStorage.setItem('nexus_projects', JSON.stringify(existingProjects))
      
      // Переходим в демо-чат
      navigate(`/chat/${demoProjectId}`)
    } finally {
      setIsLoading(false)
    }
  }

  const getExperienceText = (experience) => {
    switch (experience) {
      case 'junior': return 'Junior (0-2 года)'
      case 'middle': return 'Middle (2-5 лет)'
      case 'senior': return 'Senior (5+ лет)'
      default: return experience || 'Опыт не указан'
    }
  }

  const getEnglishLevelText = (level) => {
    switch (level) {
      case 'beginner': return 'Начальный (A1-A2)'
      case 'intermediate': return 'Средний (B1-B2)'
      case 'advanced': return 'Продвинутый (C1)'
      case 'fluent': return 'Свободный (C2)'
      default: return level || 'Не указан'
    }
  }

  return (
    <div className="freelancer-card">
      {/* Хедер карточки */}
      <div className="card-header">
        <div className="freelancer-avatar">
          {profile.avatar ? (
            <img src={profile.avatar} alt={profile.name} />
          ) : (
            <div className="avatar-placeholder">
              {profile.name?.split(' ').map(n => n[0]).join('') || 'F'}
            </div>
          )}
          {profile.online && <span className="online-indicator"></span>}
        </div>
        
        <div className="freelancer-info">
          <h3 className="freelancer-name">{profile.name}</h3>
          <p className="freelancer-title">{profile.title || 'Фрилансер'}</p>
          <div className="freelancer-meta">
            <span className="rating">
              ⭐ {profile.rating?.toFixed(1) || '5.0'}
            </span>
            <span className="projects">
              📁 {profile.completedProjects || 0} проектов
            </span>
            {profile.location && (
              <span className="location">📍 {profile.location}</span>
            )}
          </div>
        </div>
      </div>

      {/* Описание */}
      {profile.bio && (
        <div className="card-bio">
          <p>{profile.bio}</p>
        </div>
      )}

      {/* Навыки */}
      {skills.length > 0 && (
        <div className="card-skills">
          <div className="skills-list">
            {skills.slice(0, 4).map((skill, index) => {
              const skillName = typeof skill === 'string' ? skill : skill.skill || skill.name
              return (
                <span key={index} className="skill-tag">
                  {skillName}
                </span>
              )
            })}
            {skills.length > 4 && (
              <span className="skill-more">+{skills.length - 4} еще</span>
            )}
          </div>
        </div>
      )}

      {/* Детали */}
      <div className="card-details">
        <div className="detail-item">
          <span className="detail-label">Ставка:</span>
          <strong className="detail-value">{profile.hourlyRate || 0} ₽/час</strong>
        </div>
        
        {profile.experience && (
          <div className="detail-item">
            <span className="detail-label">Опыт:</span>
            <span className="detail-value">{getExperienceText(profile.experience)}</span>
          </div>
        )}
        
        {profile.englishLevel && (
          <div className="detail-item">
            <span className="detail-label">Английский:</span>
            <span className="detail-value">{getEnglishLevelText(profile.englishLevel)}</span>
          </div>
        )}
        
        <div className="detail-item">
          <span className="detail-label">Откликается:</span>
          <span className="detail-value">{profile.responseRate || 95}%</span>
        </div>
      </div>

      {/* Кнопка действия - на всю ширину */}
      <div className="card-actions">
        <button 
          className="btn btn-primary"
          onClick={handleMessageClick}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="loading-spinner"></div>
              Создание чата...
            </>
          ) : (
            <>
              💬 Написать сообщение
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default FreelancerCard