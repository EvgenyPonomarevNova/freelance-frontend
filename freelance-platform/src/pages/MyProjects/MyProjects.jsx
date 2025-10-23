// pages/MyProjects.jsx
import { useState, useEffect } from 'react'
import { apiService } from '../services/api'
import { useUser } from '../contexts/UserContext'

function MyProjects() {
  const { user } = useUser()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      let response
      if (user.role === 'client') {
        response = await apiService.getMyProjects()
      } else {
        response = await apiService.getMyResponses()
      }
      setProjects(user.role === 'client' ? response.projects : response.responses)
    } catch (error) {
      console.error('Error loading projects:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Загрузка...</div>

  return (
    <div className="my-projects">
      <h2>Мои {user.role === 'client' ? 'проекты' : 'отклики'}</h2>
      {projects.map(project => (
        <div key={project._id} className="project-item">
          <h3>{project.title}</h3>
          <p>Бюджет: {project.budget} ₽</p>
          {user.role === 'client' && (
            <p>Откликов: {project.responses.length}</p>
          )}
        </div>
      ))}
    </div>
  )
}