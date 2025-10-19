import './LoginForm.scss'
import { useState } from 'react'

function LoginForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = 'Email обязателен'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Некорректный email'
    }

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      // Здесь будет логика входа
      console.log('Вход:', formData)
      if (onSuccess) onSuccess()
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
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
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
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>
        </div>

        <div className="form-options">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
            />
            <span className="checkmark"></span>
            Запомнить меня
          </label>
          
          <a href="/forgot-password" className="forgot-password">
            Забыли пароль?
          </a>
        </div>

        <button type="submit" className="submit-btn">
          Войти в аккаунт
        </button>

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