import './ProjectsPage.scss'
import ProjectCard from '../../components/ProjectCard/ProjectCard'
import { useState, useMemo } from 'react'

function ProjectsPage() {
  // Исходные данные проектов
  const allProjects = [
    {
      id: 1,
      title: "Разработка лендинга для IT компании",
      description: "Нужно создать современный лендинг с адаптивной версткой. Требуется интеграция с CRM системой и формами обратной связи. Дизайн уже готов в Figma.",
      budget: 25000,
      skills: ["HTML/CSS", "JavaScript", "React", "Figma"],
      category: "development",
      createdAt: "2 часа назад",
      responses: 5
    },
    {
      id: 2,
      title: "Дизайн мобильного приложения для доставки еды",
      description: "Разработка UI/UX дизайна для iOS и Android приложения. Необходимо создать удобный интерфейс для заказа еды и отслеживания доставки.",
      budget: 45000,
      skills: ["UI/UX", "Figma", "Mobile Design", "Prototyping"],
      category: "design",
      createdAt: "5 часов назад",
      responses: 8
    },
    {
      id: 3,
      title: "Написание технической документации для API",
      description: "Требуется оформить документацию для REST API нашего сервиса. Необходимо описать все endpoints, параметры и примеры запросов.",
      budget: 15000,
      skills: ["Technical Writing", "API", "Documentation", "English"],
      category: "writing",
      createdAt: "вчера",
      responses: 3
    },
    {
      id: 4,
      title: "Создание логотипа и брендбука для стартапа",
      description: "Разработка логотипа и фирменного стиля для fintech стартапа. Нужно отразить современность, надежность и инновации.",
      budget: 30000,
      skills: ["Logo Design", "Branding", "Illustrator", "Brand Identity"],
      category: "design",
      createdAt: "вчера",
      responses: 12
    },
    {
      id: 5,
      title: "Разработка Telegram бота для автоматизации заказов",
      description: "Создание бота для приема заказов, уведомлений клиентов и интеграции с базой данных. Бот должен работать с платежами.",
      budget: 35000,
      skills: ["Python", "Telegram API", "PostgreSQL", "Payment Systems"],
      category: "development",
      createdAt: "2 дня назад",
      responses: 6
    },
    {
      id: 6,
      title: "SEO оптимизация интернет-магазина",
      description: "Комплексная SEO оптимизация существующего интернет-магазина. Аудит, исправление ошибок, составление семантического ядра.",
      budget:  28000,
      skills: ["SEO", "Google Analytics", "Content Writing", "E-commerce"],
      category: "marketing",
      createdAt: "2 дня назад",
      responses: 4
    }
  ]

  // Состояния для фильтров и поиска
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedBudget, setSelectedBudget] = useState('all')

  // Функция фильтрации проектов
  const filteredProjects = useMemo(() => {
    return allProjects.filter(project => {
      // Поиск по заголовку и описанию
      const matchesSearch = searchQuery === '' || 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.skills.some(skill => 
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
  }, [searchQuery, selectedCategory, selectedBudget])

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
    // Поиск уже работает через состояние
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
            {filteredProjects.reduce((sum, project) => sum + project.responses, 0)}
          </span>
          <span className="stat-label">всего откликов</span>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="no-projects">
          <div className="no-projects-icon">🔍</div>
          <h3>Проекты не найдены</h3>
          <p>Попробуйте изменить параметры поиска или фильтры</p>
        </div>
      ) : (
        <>
          <div className="projects-grid">
            {filteredProjects.map(project => (
              <ProjectCard 
                key={project.id}
                project={{
                  ...project,
                  budget: project.budget.toLocaleString('ru-RU')
                }}
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