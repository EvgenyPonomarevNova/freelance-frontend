// ProjectsPage.jsx - ИСПРАВЛЕННАЯ ВЕРСИЯ
import './ProjectsPage.scss'
import { useState, useEffect, useMemo } from 'react'
import ProjectCard from '../../components/ProjectCard/ProjectCard'
import { apiService } from '../../services/api'

function ProjectsPage() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [filters, setFilters] = useState({
    category: '',
    budgetMin: '',
    budgetMax: '',
    skills: [],
    experience: '',
    duration: ''
  })
  const [showFilters, setShowFilters] = useState(false)

  // 🔥 ФУНКЦИЯ ДЛЯ ЗАГРУЗКИ ИЗ LOCALSTORAGE
  const loadProjectsFromStorage = () => {
    try {
      const savedProjects = localStorage.getItem("nexus_projects");
      if (savedProjects) {
        const parsed = JSON.parse(savedProjects);
        console.log('📂 Loaded projects from storage:', parsed.length);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (error) {
      console.error("Error loading projects from storage:", error);
    }
    return [];
  };

  // 🔥 ФУНКЦИЯ ДЛЯ ДЕМО-ДАННЫХ
  const loadDemoProjects = () => {
    console.log('🎭 Loading demo projects');
    const demoProjects = [
      {
        id: 1,
        title: "Разработка интернет-магазина",
        description: "Нужно создать современный интернет-магазин с системой оплаты и каталогом товаров.",
        category: "development",
        budget: 50000,
        skills: ["JavaScript", "React", "Node.js", "MongoDB"],
        status: "open",
        responses: [],
        created_at: new Date().toISOString(),
        client: {
          id: 1,
          profile: {
            name: "Иван Петров",
            rating: 4.8
          }
        }
      },
      {
        id: 2,
        title: "Дизайн лендинга для стартапа",
        description: "Требуется креативный дизайн лендинга в современном стиле.",
        category: "design",
        budget: 25000,
        skills: ["Figma", "UI/UX", "Adobe Photoshop"],
        status: "open",
        responses: [],
        created_at: new Date(Date.now() - 86400000).toISOString(),
        client: {
          id: 2,
          profile: {
            name: "Анна Сидорова",
            rating: 4.9
          }
        }
      },
      {
        id: 3,
        title: "SEO продвижение сайта",
        description: "Необходимо вывести сайт в топ поисковой выдачи по ключевым запросам.",
        category: "seo",
        budget: 35000,
        skills: ["SEO", "Аналитика", "Контент-маркетинг"],
        status: "open",
        responses: [],
        created_at: new Date(Date.now() - 172800000).toISOString(),
        client: {
          id: 3,
          profile: {
            name: "Петр Иванов",
            rating: 4.7
          }
        }
      }
    ];
    setProjects(demoProjects);
    // Сохраняем демо-проекты в localStorage для будущего использования
    localStorage.setItem("nexus_projects", JSON.stringify(demoProjects));
  };

  // 🔥 ОСНОВНАЯ ФУНКЦИЯ ЗАГРУЗКИ ПРОЕКТОВ
  const loadProjects = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading projects from API...');
      
      const response = await apiService.getProjects();
      console.log('📨 API response:', response);
      
      // 🔥 РАЗНЫЕ ВАРИАНТЫ СТРУКТУРЫ ОТВЕТА
      const projectsData = response.projects || response.data || response;
      
      if (Array.isArray(projectsData) && projectsData.length > 0) {
        console.log(`✅ Loaded ${projectsData.length} projects from API`);
        setProjects(projectsData);
        
        // Сохраняем в localStorage как резервную копию
        localStorage.setItem("nexus_projects", JSON.stringify(projectsData));
      } else {
        console.log('📂 No projects from API, loading from storage...');
        const savedProjects = loadProjectsFromStorage();
        
        if (savedProjects.length > 0) {
          setProjects(savedProjects);
        } else {
          console.log('🎭 No projects found, loading demo data...');
          loadDemoProjects();
        }
      }
    } catch (error) {
      console.error('❌ Failed to load projects from API:', error);
      
      // 🔥 РЕЗЕРВНЫЙ ВАРИАНТ: загружаем из localStorage
      try {
        const savedProjects = loadProjectsFromStorage();
        if (savedProjects.length > 0) {
          console.log(`📂 Loaded ${savedProjects.length} projects from storage`);
          setProjects(savedProjects);
        } else {
          console.log('🎭 Loading demo projects as fallback');
          loadDemoProjects();
        }
      } catch (storageError) {
        console.error('❌ Failed to load projects from storage:', storageError);
        loadDemoProjects();
      }
    } finally {
      setLoading(false);
    }
  };

  // Загрузка проектов при монтировании компонента
  useEffect(() => {
    loadProjects();
  }, []);

  // Фильтрация и сортировка
  const filteredAndSortedProjects = useMemo(() => {
    if (!Array.isArray(projects)) {
      console.warn('⚠️ Projects is not an array:', projects);
      return [];
    }

    let filtered = projects.filter(project => {
      if (!project || typeof project !== 'object') return false;

      // Поиск по тексту
      const matchesSearch = searchTerm === '' || 
        (project.title && project.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (Array.isArray(project.skills) && project.skills.some(skill => 
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        ))

      // Фильтр по категории
      const matchesCategory = !filters.category || project.category === filters.category

      // Фильтр по бюджету
      const projectBudget = parseInt(project.budget) || 0
      const matchesBudgetMin = !filters.budgetMin || projectBudget >= parseInt(filters.budgetMin)
      const matchesBudgetMax = !filters.budgetMax || projectBudget <= parseInt(filters.budgetMax)

      return matchesSearch && matchesCategory && matchesBudgetMin && matchesBudgetMax
    })

    // Сортировка
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt || b.created_at || 0) - new Date(a.createdAt || a.created_at || 0)
        case 'oldest':
          return new Date(a.createdAt || a.created_at || 0) - new Date(b.createdAt || b.created_at || 0)
        case 'budget_high':
          return (parseInt(b.budget) || 0) - (parseInt(a.budget) || 0)
        case 'budget_low':
          return (parseInt(a.budget) || 0) - (parseInt(b.budget) || 0)
        case 'popular':
          return ((b.responses && b.responses.length) || 0) - ((a.responses && a.responses.length) || 0)
        default:
          return 0
      }
    })

    return filtered
  }, [projects, searchTerm, sortBy, filters])

  const categories = [
    { value: '', label: 'Все категории' },
    { value: 'development', label: '💻 Разработка' },
    { value: 'design', label: '🎨 Дизайн' },
    { value: 'marketing', label: '📊 Маркетинг' },
    { value: 'writing', label: '📝 Тексты' },
    { value: 'seo', label: '🔍 SEO' },
    { value: 'other', label: '🔧 Другое' }
  ]

  const experienceLevels = [
    { value: '', label: 'Любой уровень' },
    { value: 'beginner', label: 'Начальный' },
    { value: 'intermediate', label: 'Средний' },
    { value: 'expert', label: 'Эксперт' }
  ]

  const durations = [
    { value: '', label: 'Любой срок' },
    { value: '1week', label: 'До 1 недели' },
    { value: '1month', label: 'До 1 месяца' },
    { value: '3months', label: 'До 3 месяцев' },
    { value: 'longterm', label: 'Долгосрочный' }
  ]

  const sortOptions = [
    { value: 'newest', label: 'Сначала новые' },
    { value: 'oldest', label: 'Сначала старые' },
    { value: 'budget_high', label: 'Бюджет по убыванию' },
    { value: 'budget_low', label: 'Бюджет по возрастанию' },
    { value: 'popular', label: 'Популярные' }
  ]

  const clearFilters = () => {
    setFilters({
      category: '',
      budgetMin: '',
      budgetMax: '',
      skills: [],
      experience: '',
      duration: ''
    })
    setSearchTerm('')
  }

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== '' && (!Array.isArray(value) || value.length > 0)
  ).length + (searchTerm ? 1 : 0)

  return (
    <div className="projects-page">
      {/* Хедер страницы */}
      <div className="page-header">
        <div className="header-content">
          <h1>Найдите идеальный проект</h1>
          <p>Тысячи интересных проектов ждут своего исполнителя</p>
        </div>
        <div className="header-stats">
          <div className="stat">
            <strong>{Array.isArray(filteredAndSortedProjects) ? filteredAndSortedProjects.length : 0}</strong>
            <span>проектов найдено</span>
          </div>
        </div>
      </div>

      {/* Поиск и фильтры */}
      <div className="search-filters-section">
        {/* Строка поиска и сортировки */}
        <div className="search-sort-row">
          <div className="search-box">
            <input
              type="text"
              placeholder="Поиск проектов по названию, описанию, навыкам..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-btn">🔍</button>
          </div>
          
          <div className="sort-controls">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            <button 
              className={`filters-toggle ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              🎛️ Фильтры
              {activeFiltersCount > 0 && (
                <span className="filters-badge">{activeFiltersCount}</span>
              )}
            </button>
          </div>
        </div>

        {/* Расширенные фильтры */}
        {showFilters && (
          <div className="advanced-filters">
            <div className="filters-grid">
              <div className="filter-group">
                <label>Категория</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Бюджет от (₽)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.budgetMin}
                  onChange={(e) => setFilters({...filters, budgetMin: e.target.value})}
                />
              </div>

              <div className="filter-group">
                <label>Бюджет до (₽)</label>
                <input
                  type="number"
                  placeholder="100000"
                  value={filters.budgetMax}
                  onChange={(e) => setFilters({...filters, budgetMax: e.target.value})}
                />
              </div>

              <div className="filter-group">
                <label>Уровень опыта</label>
                <select
                  value={filters.experience}
                  onChange={(e) => setFilters({...filters, experience: e.target.value})}
                >
                  {experienceLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Срок выполнения</label>
                <select
                  value={filters.duration}
                  onChange={(e) => setFilters({...filters, duration: e.target.value})}
                >
                  {durations.map(duration => (
                    <option key={duration.value} value={duration.value}>
                      {duration.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="filter-actions">
              <button className="clear-filters" onClick={clearFilters}>
                🗑️ Очистить фильтры
              </button>
              <button className="apply-filters" onClick={() => setShowFilters(false)}>
                ✅ Применить
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Быстрые фильтры категорий */}
      <div className="quick-filters">
        <div className="quick-filters-scroll">
          {categories.slice(1).map(category => (
            <button
              key={category.value}
              className={`quick-filter ${filters.category === category.value ? 'active' : ''}`}
              onClick={() => setFilters({...filters, category: category.value})}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Список проектов */}
      <div className="projects-container">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Загрузка проектов...</p>
          </div>
        ) : filteredAndSortedProjects.length > 0 ? (
          <>
            <div className="projects-grid">
              {filteredAndSortedProjects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
            
            {/* Пагинация */}
            <div className="pagination">
              <button className="pagination-btn disabled">← Назад</button>
              <span className="pagination-info">Страница 1 из 1</span>
              <button className="pagination-btn disabled">Вперед →</button>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>Проекты не найдены</h3>
            <p>Попробуйте изменить параметры поиска или очистить фильтры</p>
            <button className="btn btn-primary" onClick={clearFilters}>
              Очистить фильтры
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={loadDemoProjects}
              style={{marginTop: '10px'}}
            >
              Загрузить демо-проекты
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectsPage