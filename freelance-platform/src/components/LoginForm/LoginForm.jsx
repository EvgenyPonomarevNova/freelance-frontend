// src/components/LoginForm/LoginForm.jsx
import './LoginForm.scss'
import { useState } from 'react'
import { useUser } from '../../contexts/UserContext'
import { useNavigate, useLocation } from 'react-router-dom'
import OAuthButtons from '../OAuthButtons/OAuthButtons' // Добавьте этот импорт

function LoginForm({ onSuccess }) {
  const { login, quickOAuthLogin } = useUser()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const from = location.state?.from?.pathname || '/profile'

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    
    if (errors.submit) {
      setErrors(prev => ({ ...prev, submit: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Некорректный формат email'
    }

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      await login(formData.email, formData.password)
      onSuccess?.()
      navigate(from, { replace: true })
    } catch (error) {
      setErrors({ submit: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async (role = 'freelancer') => {
    setIsLoading(true)
    
    try {
      const demoAccounts = {
        freelancer: {
          email: 'freelancer@demo.ru',
          password: 'demo123'
        },
        client: {
          email: 'client@demo.ru', 
          password: 'demo123'
        }
      }
      
      const demoAccount = demoAccounts[role]
      await login(demoAccount.email, demoAccount.password)
      onSuccess?.()
      navigate('/profile')
      
    } catch (error) {
      setErrors({ submit: 'Ошибка демо-входа. Создайте аккаунт.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-form">
      <div className="form-header">
        <h2>С возвращением!</h2>
        <p>Войдите в свой аккаунт</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-fields">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className={errors.email ? 'error' : ''}
              disabled={isLoading}
              autoComplete="email"
            />
            {errors.email && (
              <span className="error-text">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Введите ваш пароль"
              className={errors.password ? 'error' : ''}
              disabled={isLoading}
              autoComplete="current-password"
            />
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>
        </div>

        {errors.submit && (
          <div className="error-message">
            {errors.submit}
          </div>
        )}

        <div className="form-options">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              disabled={isLoading}
            />
            <span className="checkmark"></span>
            Запомнить меня
          </label>
          
          <a href="/forgot-password" className="forgot-password">
            Забыли пароль?
          </a>
        </div>

        <button 
          type="submit" 
          className={`submit-btn ${isLoading ? 'loading' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner"></span>
              Вход...
            </>
          ) : (
            'Войти в аккаунт'
          )}
        </button>
        {/* OAuth кнопки */}
        <OAuthButtons type="login" isLoading={isLoading} />

        <div className="form-footer">
          <p>
            Нет аккаунта? <a href="/register" className="link">Зарегистрироваться</a>
          </p>
        </div>
      </form>
    </div>
  )
}

export default LoginForm