import './RegisterForm.scss'
import { useState } from 'react'
import { useUser } from '../../contexts/UserContext'
import { useNavigate } from 'react-router-dom'

function RegisterForm() {
  const { register } = useUser()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'freelancer',
    agreeToTerms: false
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
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
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен быть не менее 6 символов'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают'
    }

    if (!formData.fullName) {
      newErrors.fullName = 'Имя обязательно'
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'Необходимо согласие с условиями'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      const newUser = register(formData)
      // Редирект на страницу настройки профиля
      navigate('/profile-setup')
    }
  }

  return (
    <div className="register-form">
      <div className="form-header">
        <h2>Присоединиться к <span className="accent">FreelanceHub</span></h2>
        <p>Создайте аккаунт и начните работать</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Выбор роли */}
        <div className="role-selection">
          <h3>Кто вы?</h3>
          <div className="role-options">
            <label className={`role-option ${formData.role === 'freelancer' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="role"
                value="freelancer"
                checked={formData.role === 'freelancer'}
                onChange={handleChange}
              />
              <div className="role-content">
                <div className="role-icon">💼</div>
                <div className="role-info">
                  <h4>Фрилансер</h4>
                  <p>Ищу проекты для работы</p>
                </div>
              </div>
            </label>

            <label className={`role-option ${formData.role === 'client' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="role"
                value="client"
                checked={formData.role === 'client'}
                onChange={handleChange}
              />
              <div className="role-content">
                <div className="role-icon">👔</div>
                <div className="role-info">
                  <h4>Заказчик</h4>
                  <p>Ищу исполнителей</p>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Основные поля */}
        <div className="form-fields">
          <div className="form-group">
            <label htmlFor="fullName">Полное имя</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Иван Иванов"
              className={errors.fullName ? 'error' : ''}
            />
            {errors.fullName && <span className="error-text">{errors.fullName}</span>}
          </div>

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
              placeholder="Не менее 6 символов"
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Подтвердите пароль</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Повторите пароль"
              className={errors.confirmPassword ? 'error' : ''}
            />
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          </div>
        </div>

        {/* Соглашение */}
        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
            />
            <span className="checkmark"></span>
            Я соглашаюсь с <a href="/rules">правилами платформы</a> и <a href="/safety">политикой конфиденциальности</a>
          </label>
          {errors.agreeToTerms && <span className="error-text">{errors.agreeToTerms}</span>}
        </div>

        <button type="submit" className="submit-btn">
          Создать аккаунт
        </button>

        <div className="form-footer">
          <p>
            Уже есть аккаунт? <a href="/login" className="link">Войти</a>
          </p>
        </div>
      </form>
    </div>
  )
}

export default RegisterForm