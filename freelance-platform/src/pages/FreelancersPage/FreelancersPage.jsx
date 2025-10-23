// pages/FreelancersPage/FreelancersPage.jsx
import './FreelancersPage.scss'
import { useState, useEffect } from 'react'
import FreelancerCard from '../../components/FreelancerCard/FreelancerCard'

function FreelancersPage() {
  const [freelancers, setFreelancers] = useState([])
  const [filters, setFilters] = useState({
    category: '',
    skills: '',
    minRating: 0
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFreelancers()
  }, [])

  const loadFreelancers = () => {
    try {
      console.log('Загрузка фрилансеров...')
      
      // Загружаем фрилансеров из localStorage
      const users = JSON.parse(localStorage.getItem('nexus_users') || '[]')
      console.log('Все пользователи:', users)
      
      const freelancerUsers = users
        .filter(user => {
          console.log('Проверка пользователя:', user)
          return user.role === 'freelancer'
        })
        .map(user => ({
          ...user,
          profile: user.profile || {
            name: user.fullName || 'Фрилансер',
            bio: '',
            skills: [],
            rating: 5.0,
            completedProjects: 0,
            responseRate: '100%',
            online: true
          }
        }))
      
      console.log('Найдено фрилансеров:', freelancerUsers)
      setFreelancers(freelancerUsers)
    } catch (error) {
      console.error('Ошибка загрузки фрилансеров:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredFreelancers = freelancers.filter(freelancer => {
    const profile = freelancer.profile || {}
    
    const matchesSearch = searchTerm === '' || 
      profile.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (Array.isArray(profile.skills) && profile.skills.some(skill => {
        const skillName = typeof skill === 'string' ? skill : skill?.skill || skill?.name
        return skillName?.toLowerCase().includes(searchTerm.toLowerCase())
      }))
    
    const matchesCategory = !filters.category || profile.category === filters.category
    const matchesRating = (profile.rating || 0) >= filters.minRating

    return matchesSearch && matchesCategory && matchesRating
  })

  console.log('Отфильтрованные фрилансеры:', filteredFreelancers)

  if (loading) {
    return (
      <div className="freelancers-page">
        <div className="loading">Загрузка фрилансеров...</div>
      </div>
    )
  }

  return (
    <div className="freelancers-page">
      <div className="page-header">
        <h1>Найдите идеального фрилансера</h1>
        <p>Тысячи талантливых исполнителей готовы помочь с вашим проектом</p>
      </div>

      <div className="search-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Поиск по имени, навыкам..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-btn">🔍</button>
        </div>

        <div className="filters">
          <select 
            value={filters.category}
            onChange={(e) => setFilters({...filters, category: e.target.value})}
          >
            <option value="">Все категории</option>
            <option value="development">💻 Разработка</option>
            <option value="design">🎨 Дизайн</option>
            <option value="marketing">📊 Маркетинг</option>
            <option value="writing">📝 Тексты</option>
          </select>

          <select 
            value={filters.minRating}
            onChange={(e) => setFilters({...filters, minRating: parseInt(e.target.value)})}
          >
            <option value={0}>Любой рейтинг</option>
            <option value={4}>⭐ 4.0+</option>
            <option value={4.5}>⭐ 4.5+</option>
            <option value={5}>⭐ 5.0</option>
          </select>
        </div>
      </div>

      <div className="freelancers-grid">
        {filteredFreelancers.length > 0 ? (
          filteredFreelancers.map(freelancer => (
            <FreelancerCard 
              key={freelancer.id} 
              freelancer={freelancer}
            />
          ))
        ) : (
          <div className="no-results">
            <h3>Фрилансеры не найдены</h3>
            <p>Попробуйте изменить параметры поиска или зарегистрируйтесь как фрилансер</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default FreelancersPage