// pages/Freelancers.jsx
import { useState, useEffect } from 'react'
import { apiService } from '../services/api'
import FreelancerCard from '../components/FreelancerCard/FreelancerCard'

function Freelancers() {
  const [freelancers, setFreelancers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: '',
    search: ''
  })

  useEffect(() => {
    loadFreelancers()
  }, [filters])

  const loadFreelancers = async () => {
    try {
      const response = await apiService.getFreelancers(filters)
      setFreelancers(response.freelancers)
    } catch (error) {
      console.error('Error loading freelancers:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="freelancers-page">
      <h2>Фрилансеры</h2>
      
      <div className="filters">
        <input
          type="text"
          placeholder="Поиск по имени или навыкам..."
          value={filters.search}
          onChange={(e) => setFilters({...filters, search: e.target.value})}
        />
        <select
          value={filters.category}
          onChange={(e) => setFilters({...filters, category: e.target.value})}
        >
          <option value="">Все категории</option>
          <option value="development">Разработка</option>
          <option value="design">Дизайн</option>
          <option value="marketing">Маркетинг</option>
        </select>
      </div>

      {loading ? (
        <div>Загрузка...</div>
      ) : (
        <div className="freelancers-grid">
          {freelancers.map(freelancer => (
            <FreelancerCard key={freelancer._id} freelancer={freelancer} />
          ))}
        </div>
      )}
    </div>
  )
}