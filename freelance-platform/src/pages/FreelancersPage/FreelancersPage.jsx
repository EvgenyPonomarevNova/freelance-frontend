// pages/FreelancersPage/FreelancersPage.jsx
import './FreelancersPage.scss'
import { useState, useEffect, useMemo } from 'react'
import FreelancerCard from '../../components/FreelancerCard/FreelancerCard'

function FreelancersPage() {
  const [freelancers, setFreelancers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('rating')
  const [filters, setFilters] = useState({
    category: '',
    skills: [],
    rating: '',
    hourlyRateMin: '',
    hourlyRateMax: '',
    location: '',
    experience: '',
    englishLevel: ''
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadFreelancers()
  }, [])

  const loadFreelancers = () => {
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('nexus_users') || '[]')
      const freelancerUsers = users
        .filter(user => user.role === 'freelancer')
        .map(user => ({
          ...user,
          profile: user.profile || {
            name: user.fullName || 'Фрилансер',
            bio: '',
            skills: [],
            rating: 4.5 + Math.random() * 0.5, // Рандомный рейтинг для демо
            completedProjects: Math.floor(Math.random() * 50),
            hourlyRate: 500 + Math.floor(Math.random() * 2000),
            location: ['Москва', 'Санкт-Петербург', 'Новосибирск', 'Удаленно'][Math.floor(Math.random() * 4)],
            experience: ['junior', 'middle', 'senior'][Math.floor(Math.random() * 3)],
            englishLevel: ['beginner', 'intermediate', 'advanced', 'fluent'][Math.floor(Math.random() * 4)],
            responseRate: 80 + Math.floor(Math.random() * 20),
            online: Math.random() > 0.5
          }
        }))
      
      setFreelancers(freelancerUsers)
      setLoading(false)
    }, 1000)
  }

  // Фильтрация и сортировка
  const filteredAndSortedFreelancers = useMemo(() => {
    let filtered = freelancers.filter(freelancer => {
      const profile = freelancer.profile || {}
      
      // Поиск по тексту
      const matchesSearch = searchTerm === '' || 
        profile.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.skills?.some(skill => {
          const skillName = typeof skill === 'string' ? skill : skill.skill || skill.name
          return skillName?.toLowerCase().includes(searchTerm.toLowerCase())
        })

      // Фильтр по категории
      const matchesCategory = !filters.category || profile.category === filters.category

      // Фильтр по рейтингу
      const matchesRating = !filters.rating || (profile.rating || 0) >= parseFloat(filters.rating)

      // Фильтр по почасовой ставке
      const hourlyRate = profile.hourlyRate || 0
      const matchesRateMin = !filters.hourlyRateMin || hourlyRate >= parseInt(filters.hourlyRateMin)
      const matchesRateMax = !filters.hourlyRateMax || hourlyRate <= parseInt(filters.hourlyRateMax)

      // Фильтр по местоположению
      const matchesLocation = !filters.location || 
        profile.location?.toLowerCase().includes(filters.location.toLowerCase())

      // Фильтр по опыту
      const matchesExperience = !filters.experience || profile.experience === filters.experience

      // Фильтр по английскому
      const matchesEnglish = !filters.englishLevel || profile.englishLevel === filters.englishLevel

      return matchesSearch && matchesCategory && matchesRating && matchesRateMin && 
             matchesRateMax && matchesLocation && matchesExperience && matchesEnglish
    })

    // Сортировка
    filtered.sort((a, b) => {
      const profileA = a.profile || {}
      const profileB = b.profile || {}
      
      switch (sortBy) {
        case 'rating':
          return (profileB.rating || 0) - (profileA.rating || 0)
        case 'projects':
          return (profileB.completedProjects || 0) - (profileA.completedProjects || 0)
        case 'rate_low':
          return (profileA.hourlyRate || 0) - (profileB.hourlyRate || 0)
        case 'rate_high':
          return (profileB.hourlyRate || 0) - (profileA.hourlyRate || 0)
        case 'name':
          return (profileA.name || '').localeCompare(profileB.name || '')
        case 'newest':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        default:
          return 0
      }
    })

    return filtered
  }, [freelancers, searchTerm, sortBy, filters])

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
    { value: '', label: 'Любой опыт' },
    { value: 'junior', label: 'Junior (0-2 года)' },
    { value: 'middle', label: 'Middle (2-5 лет)' },
    { value: 'senior', label: 'Senior (5+ лет)' }
  ]

  const englishLevels = [
    { value: '', label: 'Любой уровень' },
    { value: 'beginner', label: 'Начальный (A1-A2)' },
    { value: 'intermediate', label: 'Средний (B1-B2)' },
    { value: 'advanced', label: 'Продвинутый (C1)' },
    { value: 'fluent', label: 'Свободный (C2)' }
  ]

  const ratingOptions = [
    { value: '', label: 'Любой рейтинг' },
    { value: '4.5', label: '⭐ 4.5+ Звезд' },
    { value: '4.0', label: '⭐ 4.0+ Звезд' },
    { value: '3.0', label: '⭐ 3.0+ Звезд' }
  ]

  const sortOptions = [
    { value: 'rating', label: 'По рейтингу' },
    { value: 'projects', label: 'По количеству проектов' },
    { value: 'rate_low', label: 'По ставке (сначала дешевые)' },
    { value: 'rate_high', label: 'По ставке (сначала дорогие)' },
    { value: 'name', label: 'По имени' },
    { value: 'newest', label: 'Сначала новые' }
  ]

  const popularSkills = [
    'React', 'JavaScript', 'Python', 'UI/UX Design', 'WordPress',
    'PHP', 'Vue.js', 'Node.js', 'Figma', 'Photoshop',
    'HTML/CSS', 'TypeScript', 'Mobile Development', 'SEO', 'SMM'
  ]

  const clearFilters = () => {
    setFilters({
      category: '',
      skills: [],
      rating: '',
      hourlyRateMin: '',
      hourlyRateMax: '',
      location: '',
      experience: '',
      englishLevel: ''
    })
    setSearchTerm('')
  }

  const toggleSkill = (skill) => {
    setFilters(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }))
  }

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== '' && (!Array.isArray(value) || value.length > 0)
  ).length + (searchTerm ? 1 : 0)

  return (
    <div className="freelancers-page">
      {/* Хедер страницы */}
      <div className="page-header">
        <div className="header-content">
          <h1>Найдите идеального фрилансера</h1>
          <p>Тысячи талантливых специалистов готовы к сотрудничеству</p>
        </div>
        <div className="header-stats">
          <div className="stat">
            <strong>{filteredAndSortedFreelancers.length}</strong>
            <span>фрилансеров найдено</span>
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
              placeholder="Поиск по имени, навыкам, специализации..."
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
                <label>Специализация</label>
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
                <label>Рейтинг</label>
                <select
                  value={filters.rating}
                  onChange={(e) => setFilters({...filters, rating: e.target.value})}
                >
                  {ratingOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Ставка от (₽/час)</label>
                <input
                  type="number"
                  placeholder="500"
                  value={filters.hourlyRateMin}
                  onChange={(e) => setFilters({...filters, hourlyRateMin: e.target.value})}
                />
              </div>

              <div className="filter-group">
                <label>Ставка до (₽/час)</label>
                <input
                  type="number"
                  placeholder="5000"
                  value={filters.hourlyRateMax}
                  onChange={(e) => setFilters({...filters, hourlyRateMax: e.target.value})}
                />
              </div>

              <div className="filter-group">
                <label>Местоположение</label>
                <input
                  type="text"
                  placeholder="Город или 'Удаленно'"
                  value={filters.location}
                  onChange={(e) => setFilters({...filters, location: e.target.value})}
                />
              </div>

              <div className="filter-group">
                <label>Опыт работы</label>
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
                <label>Английский язык</label>
                <select
                  value={filters.englishLevel}
                  onChange={(e) => setFilters({...filters, englishLevel: e.target.value})}
                >
                  {englishLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Популярные навыки */}
            <div className="skills-filter">
              <label>Популярные навыки</label>
              <div className="skills-grid">
                {popularSkills.map(skill => (
                  <button
                    key={skill}
                    className={`skill-tag ${filters.skills.includes(skill) ? 'active' : ''}`}
                    onClick={() => toggleSkill(skill)}
                  >
                    {skill}
                    {filters.skills.includes(skill) && ' ✓'}
                  </button>
                ))}
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

      {/* Список фрилансеров */}
      <div className="freelancers-container">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Загрузка фрилансеров...</p>
          </div>
        ) : filteredAndSortedFreelancers.length > 0 ? (
          <>
            <div className="freelancers-grid">
              {filteredAndSortedFreelancers.map(freelancer => (
                <FreelancerCard key={freelancer.id} freelancer={freelancer} />
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
            <div className="empty-icon">👥</div>
            <h3>Фрилансеры не найдены</h3>
            <p>Попробуйте изменить параметры поиска или очистить фильтры</p>
            <button className="btn btn-primary" onClick={clearFilters}>
              Очистить фильтры
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default FreelancersPage