// contexts/UserContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'

const UserContext = createContext()

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error('Auth check failed:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const { user: userData, token } = await authService.login(email, password)
      setUser(userData)
      return userData
    } catch (error) {
      throw error
    }
  }

  const register = async (userData) => {
    try {
      const { user: newUser, token } = await authService.register(userData)
      setUser(newUser)
      return newUser
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
      setUser(null)
    } catch (error) {
      console.error('Logout failed:', error)
      setUser(null)
    }
  }

  const updateUser = async (updatedData) => {
    try {
      // В реальном приложении здесь был бы API вызов
      const updatedUser = { ...user, ...updatedData }
      setUser(updatedUser)
      localStorage.setItem('current_user', JSON.stringify(updatedUser))
      return updatedUser
    } catch (error) {
      throw error
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser
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