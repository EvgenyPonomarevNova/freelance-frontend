import './ProjectsPage.scss'
import ProjectCard from '../../components/ProjectCard/ProjectCard'
import { useState, useMemo } from 'react'

function ProjectsPage() {
  // Получаем проекты из localStorage
  const projects = JSON.parse(localStorage.getItem('nexus_projects') || '[]')
  
  // Состояния для фильтров и поиска
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedBudget, setSelectedBudget] = useState('all')

  // Функция фильтрации проектов
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      // Поиск по заголовку и описанию
      const matchesSearch = searchQuery === '' || 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.skills?.some(skill => 
          skill.toLowerCase().includes(searchQuery.toLowerCase())
        )
      
      // Фильтр по категории
      const matchesCategory = selectedCategory === 'all' || 
        project.category === selectedCategory
      
      // Фильтр по бюджету
      const matchesBudget = selectedBudget === 'all' || 
        (selectedBudget === 'low' && project.budget <= 10000) ||
        (selectedBudget === 'medium' && project.budget > 10000 && project.budget <= 25000) ||
        (selectedBudget === 'high' && project.budget > 25000 && project.budget <= 50000) ||
        (selectedBudget === 'premium' && project.budget > 50000)

      return matchesSearch && matchesCategory && matchesBudget
    })
  }, [searchQuery, selectedCategory, selectedBudget, projects])

  // Обработчики изменений
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value)
  }

  const handleBudgetChange = (e) => {
    setSelectedBudget(e.target.value)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <div className="projects-page">
      <div className="projects-header">
        <h1 className="page-title">
          Доступные <span className="title-accent">проекты</span>
        </h1>
        <p className="page-subtitle">
          Найди интересные задачи и начни зарабатывать
        </p>
      </div>

      <div className="projects-controls">
        <form className="search-box" onSubmit={handleSearchSubmit}>
          <input 
            type="text" 
            placeholder="Поиск проектов, навыков..." 
            className="search-input"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button type="submit" className="search-btn">Найти</button>
        </form>
        
        <div className="filters">
          <select 
            className="filter-select"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="all">Все категории</option>
            <option value="development">Разработка</option>
            <option value="design">Дизайн</option>
            <option value="marketing">Маркетинг</option>
            <option value="writing">Тексты</option>
          </select>
          
          <select 
            className="filter-select"
            value={selectedBudget}
            onChange={handleBudgetChange}
          >
            <option value="all">Любой бюджет</option>
            <option value="low">До 10 000 ₽</option>
            <option value="medium">10 000 - 25 000 ₽</option>
            <option value="high">25 000 - 50 000 ₽</option>
            <option value="premium">От 50 000 ₽</option>
          </select>
        </div>
      </div>

      <div className="projects-stats">
        <div className="stat">
          <span className="stat-number">{filteredProjects.length}</span>
          <span className="stat-label">найдено проектов</span>
        </div>
        <div className="stat">
          <span className="stat-number">
            {filteredProjects.reduce((sum, project) => sum + (project.responses?.length || 0), 0)}
          </span>
          <span className="stat-label">всего откликов</span>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="no-projects">
          <div className="no-projects-icon">🔍</div>
          <h3>Проекты не найдены</h3>
          <p>Попробуйте изменить параметры поиска или фильтры</p>
          <button 
            className="create-first-project-btn"
            onClick={() => window.location.href = '/create-project'}
          >
            Создать первый проект
          </button>
        </div>
      ) : (
        <>
          <div className="projects-grid">
            {filteredProjects.map(project => (
              <ProjectCard 
                key={project.id}
                project={project}
              />
            ))}
          </div>

          <div className="load-more">
            <button className="load-more-btn">
              Загрузить еще проекты
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default ProjectsPage