// components/FreelancerCard/FreelancerCard.jsx
import './FreelancerCard.scss'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../contexts/UserContext'

function FreelancerCard({ freelancer }) {
  const navigate = useNavigate()
  const { user } = useUser()
  const profile = freelancer.profile || {}

  // Функция для извлечения названий навыков из объектов
  const getSkillNames = (skills) => {
    if (!skills) return []
    
    if (Array.isArray(skills) && skills.length > 0 && typeof skills[0] === 'string') {
      return skills
    }
    
    if (Array.isArray(skills) && skills.length > 0 && typeof skills[0] === 'object') {
      return skills.map(s => s.skill || s.name || 'Навык')
    }
    
    return []
  }

  const handleProfileClick = () => {
    if (!user) {
      alert('Для просмотра профиля необходимо войти в систему')
      return
    }
    // Переходим на страницу профиля фрилансера
    navigate(`/profile/${freelancer.id}`)
  }

const handleMessageClick = async () => {
  if (!user) {
    alert('Для отправки сообщений необходимо войти в систему')
    return
  }

  // Создаем проект для чата или используем существующий
  try {
    // Сначала создаем проект
    const projectResponse = await apiService.createProject({
      title: `Обсуждение сотрудничества с ${freelancer.profile.name}`,
      description: `Чат для обсуждения возможного сотрудничества с ${freelancer.profile.name}`,
      category: 'other',
      budget: 0,
      skills: []
    })
    
    // Затем отправляем первое сообщение
    await apiService.sendMessage({
      projectId: projectResponse.project._id,
      receiverId: freelancer._id,
      text: `Здравствуйте! Интересует ваше портфолио и возможность сотрудничества.`
    })
    
    // Переходим в чат
    navigate(`/chat/${projectResponse.project._id}`)
  } catch (error) {
    alert('Ошибка при создании чата: ' + error.message)
  }
}

  const skillNames = getSkillNames(profile.skills)

  return (
    <div className="freelancer-card">
      <div className="card-header">
        <div className="avatar">
          {profile.name?.split(' ').map(n => n[0]).join('') || 'F'}
        </div>
        <div className="info">
          <h3 className="name">{profile.name || 'Фрилансер'}</h3>
          <span className="category">{getCategoryLabel(profile.category)}</span>
        </div>
        <div className="rating">
          ⭐ {profile.rating || '5.0'}
        </div>
      </div>

      <p className="bio">{profile.bio || 'Опытный специалист в своей области'}</p>

      {skillNames.length > 0 && (
        <div className="skills">
          {skillNames.slice(0, 4).map((skill, index) => (
            <span key={`${skill}-${index}`} className="skill-tag">
              {skill}
            </span>
          ))}
          {skillNames.length > 4 && (
            <span className="more-skills">+{skillNames.length - 4}</span>
          )}
        </div>
      )}

      <div className="stats">
        <div className="stat">
          <strong>{profile.completedProjects || 0}</strong>
          <span>проектов</span>
        </div>
        <div className="stat">
          <strong>{profile.responseRate || '100%'}</strong>
          <span>откликов</span>
        </div>
        <div className="stat">
          <strong>{profile.online ? 'Online' : 'Offline'}</strong>
          <span>статус</span>
        </div>
      </div>

      <div className="card-actions">
        <button 
          className="profile-btn"
          onClick={handleProfileClick}
        >
          👀 Профиль
        </button>
        <button 
          className="message-btn"
          onClick={handleMessageClick}
        >
          💬 Написать
        </button>
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

export default FreelancerCard