// contexts/UserContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'
import { apiService } from '../services/api'

const UserContext = createContext()

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const currentUser = await apiService.getCurrentUser()
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
      const response = await apiService.login(email, password)
      setUser(response.user)
      return response.user
    } catch (error) {
      throw error
    }
  }

  const register = async (userData) => {
    try {
      const response = await apiService.register(userData)
      setUser(response.user)
      return response.user
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    apiService.logout()
    setUser(null)
  }

  const updateUser = async (updatedData) => {
    try {
      const response = await apiService.updateProfile(updatedData)
      setUser(response.user)
      return response.user
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