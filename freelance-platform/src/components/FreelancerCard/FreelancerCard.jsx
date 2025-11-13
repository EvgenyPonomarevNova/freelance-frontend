// components/FreelancerCard/FreelancerCard.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import './FreelancerCard.scss'

function FreelancerCard({ freelancer }) {
  const [avatarError, setAvatarError] = useState(false)
  
  const userData = freelancer || {}
  const profile = userData.profile || {}
  const portfolio = profile.portfolio || userData.portfolio || []
  
  const name = profile.name || userData.fullName || 'Фрилансер'
  const title = profile.title || profile.category || 'Фрилансер'
  const bio = profile.bio || ''
  const skills = profile.skills || []
  const rating = profile.rating || 0
  const reviewsCount = profile.reviewsCount || profile.completedProjects || 0
  const completedProjects = profile.completedProjects || 0
  const hourlyRate = profile.hourlyRate || 0
  const location = profile.location || ''
  const experience = profile.experience || ''
  const avatar = profile.avatar || '/images/default-avatar.png'
  const online = profile.online || false

  const formatRating = (rating) => {
    return rating ? rating.toFixed(1) : '0.0'
  }

  const getExperienceLabel = (exp) => {
    const labels = {
      'junior': 'Начинающий',
      'middle': 'Опытный', 
      'senior': 'Эксперт',
      'beginner': 'Начинающий',
      'expert': 'Эксперт'
    }
    return labels[exp] || exp
  }

  const getStatus = () => {
    if (online) {
      return { text: 'онлайн', class: 'online' }
    }
    return { text: 'был недавно', class: 'offline' }
  }

  const handleAvatarError = (e) => {
    e.target.src = '/images/default-avatar.png'
    setAvatarError(true)
  }

  const handlePortfolioImageError = (e) => {
    e.target.src = '/images/portfolio-placeholder.png'
  }

  // Функция для извлечения названия навыка из объекта или строки
  const getSkillName = (skill) => {
    if (typeof skill === 'string') {
      return skill
    }
    if (skill && typeof skill === 'object') {
      return skill.skill || skill.name || 'Навык'
    }
    return 'Навык'
  }

  const status = getStatus()

  return (
    <div className="freelancer-card-fl">
      <div className="card-main">
        <div className="freelancer-info">
          <div className="avatar-section">
            <img 
              src={avatarError ? '/images/default-avatar.png' : avatar}
              alt={name}
              className="freelancer-avatar"
              onError={handleAvatarError}
              loading="lazy"
            />
            <div className={`status-indicator ${status.class}`}></div>
          </div>
          
          <div className="main-info">
            <div className="name-section">
              <Link to={`/freelancer/${userData.id}`} className="freelancer-name">
                {name}
              </Link>
              <span className={`status ${status.class}`}>{status.text}</span>
            </div>
            
            <div className="specialization">{title}</div>
            
            <div className="stats">
              <div className="stat">
                <span className="rating">
                  <span className="stars">★★★★★</span>
                  <span className="rating-value">{formatRating(rating)}</span>
                  <span className="reviews">({reviewsCount})</span>
                </span>
              </div>
              <div className="stat">
                <span className="projects">Выполнено работ: {completedProjects}</span>
              </div>
            </div>

            <div className="details">
              <div className="detail">
                <span className="label">Стоимость часа:</span>
                <span className="value">{hourlyRate} ₽</span>
              </div>
              <div className="detail">
                <span className="label">Местоположение:</span>
                <span className="value">{location || 'Не указано'}</span>
              </div>
              <div className="detail">
                <span className="label">Опыт работы:</span>
                <span className="value">{getExperienceLabel(experience)}</span>
              </div>
            </div>

            {bio && (
              <div className="bio">
                <p>{bio.length > 120 ? `${bio.substring(0, 120)}...` : bio}</p>
              </div>
            )}

            {skills.length > 0 && (
              <div className="skills">
                <div className="skills-list">
                  {skills.slice(0, 8).map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {getSkillName(skill)}
                    </span>
                  ))}
                  {skills.length > 8 && (
                    <span className="skill-tag more">+{skills.length - 8}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {portfolio.length > 0 && (
          <div className="portfolio-section">
            <div className="portfolio-header">
              <span className="portfolio-title">Примеры работ</span>
              <Link to={`/freelancer/${userData.id}`} className="view-all">
                все работы →
              </Link>
            </div>
            <div className="portfolio-grid">
              {portfolio.slice(0, 3).map((work, index) => (
                <div key={index} className="portfolio-item">
                  <div className="portfolio-image-container">
                    <img 
                      src={work.image || work.thumbnail || '/images/portfolio-placeholder.png'} 
                      alt={work.title || 'Работа'}
                      className="portfolio-image"
                      onError={handlePortfolioImageError}
                      loading="lazy"
                    />
                    <div className="portfolio-overlay">
                      <span className="view-icon">👁️</span>
                    </div>
                  </div>
                  <div className="portfolio-info">
                    <span className="portfolio-work-title">
                      {work.title || 'Проект'}
                    </span>
                    {work.price && (
                      <span className="portfolio-price">{work.price} ₽</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="card-actions">
        <Link 
          to={`/freelancer/${userData.id}`} 
          className="btn btn-profile"
        >
          Перейти в профиль
        </Link>
        <button className="btn btn-message">
          Написать сообщение
        </button>
      </div>
    </div>
  )
}

export default FreelancerCard