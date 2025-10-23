import { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext()

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Загрузка пользователя из localStorage при загрузке приложения
  useEffect(() => {
    const savedUser = localStorage.getItem('nexus_current_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  // Регистрация нового пользователя
  const register = (userData) => {
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      profile: {
        name: userData.fullName,
        title: '',
        description: '',
        hourlyRate: userData.role === 'freelancer' ? 0 : null,
        location: '',
        experience: '',
        completedProjects: 0,
        rating: 0,
        avatar: null,
        skills: [],
        portfolio: [],
        experienceList: []
      },
      createdAt: new Date().toISOString()
    }
    
    // Сохраняем в список пользователей
    const users = JSON.parse(localStorage.getItem('nexus_users') || '[]')
    users.push(newUser)
    localStorage.setItem('nexus_users', JSON.stringify(users))
    
    // Автоматически входим после регистрации
    setUser(newUser)
    localStorage.setItem('nexus_current_user', JSON.stringify(newUser))
    
    return newUser
  }

  // Вход пользователя
  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('nexus_current_user', JSON.stringify(userData))
  }

  // Выход
  const logout = () => {
    setUser(null)
    localStorage.removeItem('nexus_current_user')
  }

  // Обновление профиля
  const updateProfile = (profileData) => {
    const updatedUser = {
      ...user,
      profile: {
        ...user.profile,
        ...profileData
      }
    }
    setUser(updatedUser)
    localStorage.setItem('nexus_current_user', JSON.stringify(updatedUser))
    
    // Также обновляем в общем списке пользователей
    const users = JSON.parse(localStorage.getItem('nexus_users') || '[]')
    const userIndex = users.findIndex(u => u.id === user.id)
    if (userIndex !== -1) {
      users[userIndex] = updatedUser
      localStorage.setItem('nexus_users', JSON.stringify(users))
    }
  }

  // Добавление навыка
  const addSkill = (skill, level) => {
    const updatedUser = {
      ...user,
      profile: {
        ...user.profile,
        skills: [...user.profile.skills, { skill, level }]
      }
    }
    setUser(updatedUser)
    localStorage.setItem('nexus_current_user', JSON.stringify(updatedUser))
  }

  // Удаление навыка
  const removeSkill = (skillToRemove) => {
    const updatedUser = {
      ...user,
      profile: {
        ...user.profile,
        skills: user.profile.skills.filter(s => s.skill !== skillToRemove)
      }
    }
    setUser(updatedUser)
    localStorage.setItem('nexus_current_user', JSON.stringify(updatedUser))
  }

  // Добавление проекта в портфолио
  const addPortfolioItem = (item) => {
    const newItem = {
      id: Date.now().toString(),
      ...item
    }
    const updatedUser = {
      ...user,
      profile: {
        ...user.profile,
        portfolio: [...user.profile.portfolio, newItem]
      }
    }
    setUser(updatedUser)
    localStorage.setItem('nexus_current_user', JSON.stringify(updatedUser))
  }

  // Удаление проекта из портфолио
  const removePortfolioItem = (itemId) => {
    const updatedUser = {
      ...user,
      profile: {
        ...user.profile,
        portfolio: user.profile.portfolio.filter(item => item.id !== itemId)
      }
    }
    setUser(updatedUser)
    localStorage.setItem('nexus_current_user', JSON.stringify(updatedUser))
  }

  const value = {
    user,
    isLoading,
    register,
    login,
    logout,
    updateProfile,
    addSkill,
    removeSkill,
    addPortfolioItem,
    removePortfolioItem
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}