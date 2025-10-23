// src/services/api.js
class ApiService {
  constructor() {
    // Определяем базовый URL
    this.baseURL = this.getBaseURL()
    this.isMockMode = false
  }

  getBaseURL() {
    // Для разработки - localhost, для продакшена - ваш домен
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:3001/api'
    }
    return 'https://your-production-domain.com/api'
  }

  async request(endpoint, options = {}) {
    // Если в mock mode, сразу выбрасываем ошибку для перехода к fallback
    if (this.isMockMode) {
      throw new Error('MOCK_MODE_ACTIVE')
    }

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

    // Преобразуем тело в JSON если нужно
    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body)
    }

    try {
      console.log(`API Request: ${url}`, config)
      const response = await fetch(url, config)
      
      if (!response.ok) {
        // Если 401 - неавторизован, очищаем токен
        if (response.status === 401) {
          localStorage.removeItem('auth_token')
          localStorage.removeItem('current_user')
        }
        throw new Error(`HTTP ${response.status}`)
      }
      
      return await response.json()
      
    } catch (error) {
      console.warn('API request failed, switching to mock mode:', error.message)
      
      // Переключаемся в mock mode при ошибках сети
      this.isMockMode = true
      throw new Error('SERVER_UNAVAILABLE')
    }
  }

  // Вспомогательные методы
  async get(endpoint) {
    return this.request(endpoint)
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: data,
    })
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data,
    })
  }

  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    })
  }
}

// Создаем и экспортируем экземпляр
export const apiService = new ApiService()