// pages/MyProjectsPage/MyProjectsPage.jsx
import './MyProjectsPage.scss'
import { useState, useEffect } from 'react'
import { useUser } from '../../contexts/UserContext'
import { Link } from 'react-router-dom'

function MyProjectsPage() {
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState('active')
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProjects()
  }, [user])

  const loadProjects = () => {
    // Имитация загрузки проектов из localStorage
    setTimeout(() => {
      const allProjects = JSON.parse(localStorage.getItem('nexus_projects') || '[]')
      
      if (user?.role === 'client') {
        // Проекты созданные текущим пользователем
        const myProjects = allProjects.filter(project => project.client?.id === user.id)
        setProjects(myProjects)
      } else if (user?.role === 'freelancer') {
        // Проекты на которые откликнулся фрилансер
        const respondedProjects = allProjects.filter(project => 
          project.responses?.some(response => response.freelancer.id === user.id)
        )
        setProjects(respondedProjects)
      }
      
      setLoading(false)
    }, 1000)
  }

  const tabs = [
    { id: 'active', name: 'Активные', count: projects.filter(p => p.status === 'open').length },
    { id: 'in-progress', name: 'В работе', count: projects.filter(p => p.status === 'in_progress').length },
    { id: 'completed', name: 'Завершенные', count: projects.filter(p => p.status === 'completed').length },
    { id: 'cancelled', name: 'Отмененные', count: projects.filter(p => p.status === 'cancelled').length }
  ]

  const filteredProjects = projects.filter(project => {
    switch (activeTab) {
      case 'active': return project.status === 'open'
      case 'in-progress': return project.status === 'in_progress'
      case 'completed': return project.status === 'completed'
      case 'cancelled': return project.status === 'cancelled'
      default: return true
    }
  })

  // Вынесем функцию getStatusBadge наружу, чтобы она была доступна в ProjectCard
  const getStatusBadge = (status) => {
    const statusConfig = {
      open: { label: 'Открыт', color: '#27ae60', bgColor: 'rgba(39, 174, 96, 0.1)' },
      in_progress: { label: 'В работе', color: '#3498db', bgColor: 'rgba(52, 152, 219, 0.1)' },
      completed: { label: 'Завершен', color: '#95a5a6', bgColor: 'rgba(149, 165, 166, 0.1)' },
      cancelled: { label: 'Отменен', color: '#e74c3c', bgColor: 'rgba(231, 76, 60, 0.1)' }
    }
    
    const config = statusConfig[status] || statusConfig.open
    return (
      <span 
        className="status-badge"
        style={{ color: config.color, backgroundColor: config.bgColor }}
      >
        {config.label}
      </span>
    )
  }

  if (!user) {
    return (
      <div className="my-projects-page">
        <div className="not-authorized">
          <h2>Требуется авторизация</h2>
          <p>Войдите в систему для просмотра ваших проектов</p>
          <Link to="/login" className="btn btn-primary">Войти</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="my-projects-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Мои проекты</h1>
          <p>Управляйте вашими проектами и отслеживайте прогресс</p>
        </div>
        {user?.role === 'client' && (
          <Link to="/create-project" className="create-project-btn">
            + Создать проект
          </Link>
        )}
      </div>

      {/* Статистика */}
      <div className="projects-stats">
        <div className="stat-card">
          <div className="stat-value">{projects.length}</div>
          <div className="stat-label">Всего проектов</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {projects.filter(p => p.status === 'open').length}
          </div>
          <div className="stat-label">Активные</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {projects.filter(p => p.status === 'in_progress').length}
          </div>
          <div className="stat-label">В работе</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {projects.filter(p => p.status === 'completed').length}
          </div>
          <div className="stat-label">Завершено</div>
        </div>
      </div>

      {/* Табы */}
      <div className="projects-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.name}
            {tab.count > 0 && <span className="tab-count">{tab.count}</span>}
          </button>
        ))}
      </div>

      {/* Список проектов */}
      <div className="projects-list">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Загрузка проектов...</p>
          </div>
        ) : filteredProjects.length > 0 ? (
          filteredProjects.map(project => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              userRole={user.role}
              getStatusBadge={getStatusBadge} // Передаем функцию как проп
            />
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>Проекты не найдены</h3>
            <p>
              {activeTab === 'active' && user.role === 'client' 
                ? 'Создайте ваш первый проект чтобы начать работу'
                : `У вас нет проектов в категории "${tabs.find(t => t.id === activeTab)?.name}"`
              }
            </p>
            {activeTab === 'active' && user.role === 'client' && (
              <Link to="/create-project" className="btn btn-primary">
                Создать проект
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Компонент карточки проекта
function ProjectCard({ project, userRole, getStatusBadge }) { // Добавляем getStatusBadge в пропсы
  const responsesCount = project.responses?.length || 0
  const myResponse = project.responses?.find(r => r.freelancer.id === project.currentUser?.id)

  return (
    <div className="project-card">
      <div className="project-header">
        <div className="project-info">
          <h3 className="project-title">
            <Link to={`/projects/${project.id}`}>{project.title}</Link>
          </h3>
          <div className="project-meta">
            <span className="project-budget">{project.budget} ₽</span>
            <span className="project-category">{getCategoryLabel(project.category)}</span>
            <span className="project-date">{formatDate(project.createdAt)}</span>
          </div>
        </div>
        <div className="project-actions">
          {getStatusBadge(project.status)}
          {userRole === 'client' && project.status === 'open' && (
            <button className="btn btn-outline">Управлять</button>
          )}
          {userRole === 'freelancer' && myResponse && (
            <span className="response-status">
              {myResponse.status === 'accepted' ? '✅ Принят' : '⏳ На рассмотрении'}
            </span>
          )}
        </div>
      </div>

      <p className="project-description">{project.description}</p>

      {userRole === 'client' && project.status === 'open' && (
        <div className="project-stats">
          <div className="stat">
            <strong>{responsesCount}</strong>
            <span>откликов</span>
          </div>
          <div className="stat">
            <strong>{project.views || 0}</strong>
            <span>просмотров</span>
          </div>
          <div className="stat">
            <strong>{project.skills?.length || 0}</strong>
            <span>навыков</span>
          </div>
        </div>
      )}

      <div className="project-footer">
        <div className="skills">
          {project.skills?.slice(0, 3).map((skill, index) => (
            <span key={index} className="skill-tag">
              {typeof skill === 'string' ? skill : skill.skill}
            </span>
          ))}
          {project.skills?.length > 3 && (
            <span className="more-skills">+{project.skills.length - 3} еще</span>
          )}
        </div>
        
        <div className="action-buttons">
          {userRole === 'client' && (
            <>
              <Link to={`/chat/${project.id}`} className="btn btn-outline">
                💬 Чат
              </Link>
              <button className="btn btn-outline">📊 Статистика</button>
            </>
          )}
          {userRole === 'freelancer' && (
            <Link to={`/chat/${project.id}`} className="btn btn-primary">
              💬 Написать заказчику
            </Link>
          )}
        </div>
      </div>
    </div>
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
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

export default MyProjectsPage