// services/projectService.js
import { apiService } from './api'

class ProjectService {
  async getProjects(filters = {}) {
    try {
      if (!apiService.isMockMode) {
        const queryParams = new URLSearchParams(filters).toString()
        return await apiService.request(`/projects?${queryParams}`)
      }
    } catch (error) {
      console.log('API недоступен, используем localStorage')
    }

    // Fallback на localStorage
    const projects = JSON.parse(localStorage.getItem('nexus_projects') || '[]')
    
    // Применяем фильтры
    let filteredProjects = projects
    
    if (filters.category) {
      filteredProjects = filteredProjects.filter(p => p.category === filters.category)
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filteredProjects = filteredProjects.filter(p => 
        p.title.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.skills?.some(skill => 
          typeof skill === 'string' 
            ? skill.toLowerCase().includes(searchTerm)
            : skill.skill?.toLowerCase().includes(searchTerm)
        )
      )
    }

    return filteredProjects
  }

  async createProject(projectData) {
    try {
      if (!apiService.isMockMode) {
        return await apiService.request('/projects', {
          method: 'POST',
          body: JSON.stringify(projectData),
        })
      }
    } catch (error) {
      console.log('API недоступен, используем localStorage')
    }

    // Fallback на localStorage
    const projects = JSON.parse(localStorage.getItem('nexus_projects') || '[]')
    const newProject = {
      id: Date.now().toString(),
      ...projectData,
      createdAt: new Date().toISOString(),
      status: 'open',
      responses: [],
      views: 0
    }

    projects.unshift(newProject)
    localStorage.setItem('nexus_projects', JSON.stringify(projects))
    
    return newProject
  }

  async respondToProject(projectId, responseData) {
    try {
      if (!apiService.isMockMode) {
        return await apiService.request(`/projects/${projectId}/respond`, {
          method: 'POST',
          body: JSON.stringify(responseData),
        })
      }
    } catch (error) {
      console.log('API недоступен, используем localStorage')
    }

    // Fallback на localStorage
    const projects = JSON.parse(localStorage.getItem('nexus_projects') || '[]')
    const projectIndex = projects.findIndex(p => p.id === projectId)
    
    if (projectIndex === -1) {
      throw new Error('Проект не найден')
    }

    const newResponse = {
      id: Date.now().toString(),
      ...responseData,
      createdAt: new Date().toISOString(),
      status: 'pending'
    }

    projects[projectIndex].responses.push(newResponse)
    localStorage.setItem('nexus_projects', JSON.stringify(projects))
    
    return newResponse
  }
}

export const projectService = new ProjectService()