// services/authService.js
import { apiService } from './api'

class AuthService {
  async login(email, password) {
    try {
      // Пробуем реальный API
      if (!apiService.isMockMode) {
        const response = await apiService.post('/auth/login', { email, password })
        return response
      }
    } catch (error) {
      if (error.message === 'SERVER_UNAVAILABLE') {
        console.log('API недоступен, используем localStorage')
      } else {
        throw error // Пробрасываем другие ошибки
      }
    }

    // Fallback на localStorage
    const users = JSON.parse(localStorage.getItem('nexus_users') || '[]')
    const user = users.find(u => u.email === email && u.password === password)
    
    if (!user) {
      throw new Error('Неверный email или пароль')
    }

    const token = this.generateToken(user.id)
    
    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.profile
      },
      token
    }
  }

  async register(userData) {
    try {
      if (!apiService.isMockMode) {
        const response = await apiService.post('/auth/register', userData)
        return response
      }
    } catch (error) {
      if (error.message === 'SERVER_UNAVAILABLE') {
        console.log('API недоступен, используем localStorage')
      } else {
        throw error
      }
    }

    // Fallback на localStorage
    const users = JSON.parse(localStorage.getItem('nexus_users') || '[]')
    
    if (users.find(u => u.email === userData.email)) {
      throw new Error('Пользователь с таким email уже существует')
    }

    const newUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString(),
      profile: {
        name: userData.fullName,
        rating: 5.0,
        completedProjects: 0,
        responseRate: '100%',
        online: true,
        bio: '',
        skills: []
      }
    }

    users.push(newUser)
    localStorage.setItem('nexus_users', JSON.stringify(users))

    const token = this.generateToken(newUser.id)
    
    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        profile: newUser.profile
      },
      token
    }
  }

  async logout() {
    try {
      if (!apiService.isMockMode) {
        await apiService.post('/auth/logout')
      }
    } catch (error) {
      if (error.message !== 'SERVER_UNAVAILABLE') {
        console.log('Logout API call failed:', error)
      }
    }

    // Всегда очищаем localStorage
    localStorage.removeItem('auth_token')
    localStorage.removeItem('current_user')
  }

  async getCurrentUser() {
    const token = localStorage.getItem('auth_token')
    if (!token) return null

    try {
      if (!apiService.isMockMode) {
        const user = await apiService.get('/auth/me')
        return user
      }
    } catch (error) {
      if (error.message === 'SERVER_UNAVAILABLE') {
        console.log('API недоступен, используем localStorage')
      } else {
        // Если ошибка авторизации, очищаем токен
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          this.logout()
        }
        throw error
      }
    }

    // Fallback на localStorage
    const currentUser = localStorage.getItem('current_user')
    return currentUser ? JSON.parse(currentUser) : null
  }

  // Вспомогательный метод для генерации токена
  generateToken(userId) {
    const tokenData = { 
      userId, 
      timestamp: Date.now(),
      random: Math.random().toString(36).substring(2)
    }
    return btoa(JSON.stringify(tokenData))
  }

  // Метод для проверки валидности токена
  validateToken(token) {
    try {
      const tokenData = JSON.parse(atob(token))
      // Проверяем что токен не старше 7 дней
      const isExpired = Date.now() - tokenData.timestamp > 7 * 24 * 60 * 60 * 1000
      return !isExpired
    } catch {
      return false
    }
  }
}

export const authService = new AuthService()