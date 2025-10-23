// pages/FreelancerProfilePage/FreelancerProfilePage.jsx
import './FreelancerProfilePage.scss'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import PortfolioItem from '../../components/PortfolioItem/PortfolioItem'

function FreelancerProfilePage() {
  const { freelancerId } = useParams()
  const [freelancer, setFreelancer] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFreelancer()
  }, [freelancerId])

  const loadFreelancer = () => {
    try {
      const users = JSON.parse(localStorage.getItem('nexus_users') || '[]')
      const foundFreelancer = users.find(user => user.id === freelancerId && user.role === 'freelancer')
      
      if (foundFreelancer) {
        setFreelancer({
          ...foundFreelancer,
          profile: foundFreelancer.profile || {
            name: foundFreelancer.fullName || 'Фрилансер',
            bio: '',
            skills: [],
            rating: 5.0,
            completedProjects: 0,
            responseRate: '100%'
          }
        })
      }
    } catch (error) {
      console.error('Ошибка загрузки профиля:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Загрузка профиля...</div>
  }

  if (!freelancer) {
    return (
      <div className="profile-not-found">
        <h3>Профиль не найден</h3>
        <p>Фрилансер с таким ID не существует</p>
      </div>
    )
  }

  const profile = freelancer.profile || {}

  return (
    <div className="freelancer-profile">
      <div className="profile-header">
        <div className="avatar-large">
          {profile.name?.split(' ').map(n => n[0]).join('') || 'F'}
        </div>
        <div className="profile-info">
          <h1>{profile.name}</h1>
          <p className="category">{getCategoryLabel(profile.category)}</p>
          <div className="rating">⭐ {profile.rating || '5.0'}</div>
          <p className="bio">{profile.bio}</p>
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat-card">
          <strong>{profile.completedProjects || 0}</strong>
          <span>Завершенных проектов</span>
        </div>
        <div className="stat-card">
          <strong>{profile.responseRate || '100%'}</strong>
          <span>Процент откликов</span>
        </div>
        <div className="stat-card">
          <strong>{profile.onTimeDelivery || '95%'}</strong>
          <span>В срок</span>
        </div>
      </div>

      {profile.skills && profile.skills.length > 0 && (
        <div className="skills-section">
          <h2>Навыки</h2>
          <div className="skills-grid">
            {profile.skills.map((skill, index) => (
              <div key={index} className="skill-item">
                <span className="skill-name">
                  {typeof skill === 'string' ? skill : skill.skill || skill.name}
                </span>
                {typeof skill === 'object' && skill.level && (
                  <span className="skill-level">{getLevelText(skill.level)}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="portfolio-section">
        <h2>Портфолио</h2>
        {profile.portfolio && profile.portfolio.length > 0 ? (
          <div className="portfolio-grid">
            {profile.portfolio.map((item, index) => (
              <PortfolioItem key={index} item={item} />
            ))}
          </div>
        ) : (
          <p className="no-portfolio">Портфолио пока пустое</p>
        )}
      </div>
    </div>
  )
}

function getCategoryLabel(category) {
  const categories = {
    development: '💻 Разработчик',
    design: '🎨 Дизайнер', 
    marketing: '📊 Маркетолог',
    writing: '📝 Копирайтер',
    seo: '🔍 SEO-специалист',
    other: '🔧 Специалист'
  }
  return categories[category] || 'Фрилансер'
}

function getLevelText(level) {
  const levels = {
    beginner: 'Начальный',
    intermediate: 'Средний',
    advanced: 'Продвинутый',
    expert: 'Эксперт'
  }
  return levels[level] || level
}

export default FreelancerProfilePage