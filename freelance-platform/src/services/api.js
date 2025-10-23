// src/services/api.js
class ApiService {
  constructor() {
    this.baseURL = 'http://localhost:3001/api'
    this.isMockMode = false
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    // Добавляем токен авторизации
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Если есть тело запроса, преобразуем в JSON
    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body)
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        // Если 401 - неавторизован, очищаем токен
        if (response.status === 401) {
          localStorage.removeItem('auth_token')
          localStorage.removeItem('current_user')
          window.location.href = '/login'
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
      
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Auth methods
  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: { email, password },
    })
    
    // Сохраняем токен и пользователя
    if (response.token) {
      localStorage.setItem('auth_token', response.token)
      localStorage.setItem('current_user', JSON.stringify(response.user))
    }
    
    return response
  }

  async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: userData,
    })
    
    // Сохраняем токен и пользователя
    if (response.token) {
      localStorage.setItem('auth_token', response.token)
      localStorage.setItem('current_user', JSON.stringify(response.user))
    }
    
    return response
  }

  async getCurrentUser() {
    try {
      const response = await this.request('/auth/me')
      return response.user
    } catch (error) {
      // Если ошибка авторизации, очищаем localStorage
      if (error.message.includes('401')) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('current_user')
      }
      return null
    }
  }

  // Project methods
  async getProjects(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString()
    return this.request(`/projects?${queryParams}`)
  }

  async createProject(projectData) {
    return this.request('/projects', {
      method: 'POST',
      body: projectData,
    })
  }

  async getProject(projectId) {
    return this.request(`/projects/${projectId}`)
  }

  async respondToProject(projectId, responseData) {
    return this.request(`/projects/${projectId}/respond`, {
      method: 'POST',
      body: responseData,
    })
  }

  async getMyResponses() {
    return this.request('/projects/my/responses')
  }

  async getMyProjects() {
    return this.request('/projects/client/my-projects')
  }

  async updateResponseStatus(projectId, responseId, status) {
    return this.request(`/projects/${projectId}/responses/${responseId}`, {
      method: 'PATCH',
      body: { status },
    })
  }

  // User methods
  async getFreelancers(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString()
    return this.request(`/users/freelancers?${queryParams}`)
  }

  async getUserProfile(userId) {
    return this.request(`/users/${userId}`)
  }

  async updateProfile(profileData) {
    return this.request('/users/profile', {
      method: 'PATCH',
      body: profileData,
    })
  }

  // Chat methods
  async sendMessage(messageData) {
    return this.request('/chat/message', {
      method: 'POST',
      body: messageData,
    })
  }

  async getMessages(projectId) {
    return this.request(`/chat/${projectId}/messages`)
  }

  logout() {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('current_user')
  }
}

export const apiService = new ApiService()