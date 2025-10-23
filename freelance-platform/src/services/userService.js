// services/userService.js
import { apiService } from './api'

class UserService {
  async getFreelancers(filters = {}) {
    try {
      if (!apiService.isMockMode) {
        const queryParams = new URLSearchParams(filters).toString()
        return await apiService.request(`/users/freelancers?${queryParams}`)
      }
    } catch (error) {
      console.log('API недоступен, используем localStorage')
    }

    // Fallback на localStorage
    const users = JSON.parse(localStorage.getItem('nexus_users') || '[]')
    const freelancers = users.filter(u => u.role === 'freelancer')
    
    // Применяем фильтры
    let filteredFreelancers = freelancers
    
    if (filters.category) {
      filteredFreelancers = filteredFreelancers.filter(f => 
        f.profile?.category === filters.category
      )
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filteredFreelancers = filteredFreelancers.filter(f => 
        f.profile?.name?.toLowerCase().includes(searchTerm) ||
        f.profile?.bio?.toLowerCase().includes(searchTerm) ||
        f.profile?.skills?.some(skill => 
          typeof skill === 'string' 
            ? skill.toLowerCase().includes(searchTerm)
            : skill.skill?.toLowerCase().includes(searchTerm)
        )
      )
    }

    return filteredFreelancers
  }

  async updateProfile(userId, profileData) {
    try {
      if (!apiService.isMockMode) {
        return await apiService.request(`/users/${userId}/profile`, {
          method: 'PUT',
          body: JSON.stringify(profileData),
        })
      }
    } catch (error) {
      console.log('API недоступен, используем localStorage')
    }

    // Fallback на localStorage
    const users = JSON.parse(localStorage.getItem('nexus_users') || '[]')
    const userIndex = users.findIndex(u => u.id === userId)
    
    if (userIndex === -1) {
      throw new Error('Пользователь не найден')
    }

    users[userIndex].profile = { ...users[userIndex].profile, ...profileData }
    localStorage.setItem('nexus_users', JSON.stringify(users))
    
    // Обновляем текущего пользователя
    const currentUser = localStorage.getItem('current_user')
    if (currentUser) {
      const parsedUser = JSON.parse(currentUser)
      if (parsedUser.id === userId) {
        parsedUser.profile = users[userIndex].profile
        localStorage.setItem('current_user', JSON.stringify(parsedUser))
      }
    }

    return users[userIndex]
  }
}

export const userService = new UserService()