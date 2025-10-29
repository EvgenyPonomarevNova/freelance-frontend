// pages/HomePage/HomePage.jsx
import './HomePage.scss'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function HomePage() {
  const [showEarlyAccess, setShowEarlyAccess] = useState(false)

  // Показываем баннер через 2 секунды после загрузки
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowEarlyAccess(true)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  const [stats, setStats] = useState([
    { value: '1,000+', label: 'Ожидают запуска' },
    { value: '50+', label: 'Уже оставили заявку' },
    { value: '0%', label: 'Комиссия для первых' }
  ])

  const categories = [
    { icon: '💻', name: 'Разработка', count: 'Скоро доступно' },
    { icon: '🎨', name: 'Дизайн', count: 'Скоро доступно' },
    { icon: '📝', name: 'Тексты', count: 'Скоро доступно' },
    { icon: '📊', name: 'Маркетинг', count: 'Скоро доступно' },
    { icon: '🔍', name: 'SEO', count: 'Скоро доступно' },
    { icon: '📱', name: 'Мобильные приложения', count: 'Скоро доступно' }
  ]

  const howItWorks = [
    {
      step: '1',
      title: 'Публикуйте проект',
      description: 'Опишите вашу задачу и получите предложения от фрилансеров за считанные минуты',
      icon: '📋'
    },
    {
      step: '2',
      title: 'Выбирайте исполнителей',
      description: 'Сравнивайте отклики, изучайте портфолио и отзывы, выбирайте лучшего',
      icon: '⭐'
    },
    {
      step: '3',
      title: 'Безопасная работа',
      description: 'Оплачивайте только когда работа выполнена. Ваши средства защищены',
      icon: '🛡️'
    }
  ]

  const testimonials = [
    {
      text: 'FreelanceHab изменит подход к найму. Теперь можно находить талантливых специалистов за несколько часов.',
      author: 'Команда FreelanceHab',
      role: 'Основатели проекта',
      avatar: '🚀'
    }
  ]

  return (
    <div className="home-page">
      {/* Early Access Banner */}
      {showEarlyAccess && (
        <div className="early-access-banner">
          <div className="banner-content">
            <div className="banner-text">
              <span className="banner-badge">🚀 СКОРО ЗАПУСК</span>
              <h3>Станьте одним из первых пользователей FreelanceHab!</h3>
              <p>Получите ранний доступ и особые условия при запуске</p>
            </div>
            <div className="banner-actions">
              <Link to="/early-access" className="btn btn-primary">
                Получить ранний доступ
              </Link>
              <button 
                className="btn btn-secondary"
                onClick={() => setShowEarlyAccess(false)}
              >
                Смотреть дальше
              </button>
            </div>
            <button 
              className="banner-close"
              onClick={() => setShowEarlyAccess(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <div className="construction-notice">
              <span className="construction-badge">🏗️ В АКТИВНОЙ РАЗРАБОТКЕ</span>
              <h1 className="hero-title">
                Новая фриланс-биржа<br />
                <span className="gradient-text">FreelanceHab</span><br />
                скоро откроется!
              </h1>
            </div>
            <p className="hero-subtitle">
              Присоединяйтесь к списку ожидания и получите эксклюзивные преимущества при запуске платформы
            </p>
            <div className="hero-buttons">
              <Link to="/early-access" className="btn btn-primary">
                🚀 Получить ранний доступ
              </Link>
              <Link to="/how-it-works" className="btn btn-secondary">
                Как это работает
              </Link>
            </div>
            <div className="hero-stats">
              {stats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-card card-1">
              <div className="card-header">
                <span className="avatar">👨‍💼</span>
                <div className="user-info">
                  <strong>Заказчик</strong>
                  <span>Ищет специалиста</span>
                </div>
              </div>
              <p>Нужен SMM специалист для продвижения бренда...</p>
              <div className="card-budget">Скоро на FreelanceHab</div>
            </div>
            <div className="floating-card card-2">
              <div className="card-header">
                <span className="avatar">👩‍🎨</span>
                <div className="user-info">
                  <strong>Дизайнер UI/UX</strong>
                  <span>Готов к проектам</span>
                </div>
              </div>
              <p>Создание современного дизайна для мобильного приложения...</p>
              <div className="card-budget">Скоро на FreelanceHab</div>
            </div>
            <div className="floating-card card-3">
              <div className="card-header">
                <span className="avatar">👨‍💻</span>
                <div className="user-info">
                  <strong>React разработчик</strong>
                  <span>В поиске работы</span>
                </div>
              </div>
              <p>Разработка корпоративного портала на React...</p>
              <div className="card-budget">Скоро на FreelanceHab</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Категории проектов</h2>
          <div className="categories-grid">
            {categories.map((category, index) => (
              <div key={index} className="category-card">
                <div className="category-icon">{category.icon}</div>
                <h3>{category.name}</h3>
                <p>{category.count}</p>
                <div className="category-link">
                  Скоро доступно →
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <h2 className="section-title">Как будет работать FreelanceHab</h2>
          <div className="steps-grid">
            {howItWorks.map((step, index) => (
              <div key={index} className="step-card">
                <div className="step-number">{step.step}</div>
                <div className="step-icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">О проекте</h2>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-text">"{testimonial.text}"</div>
                <div className="testimonial-author">
                  <span className="avatar">{testimonial.avatar}</span>
                  <div className="author-info">
                    <strong>{testimonial.author}</strong>
                    <span>{testimonial.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Готовы стать первыми?</h2>
            <p>Присоединяйтесь к списку ожидания и получите особые условия при запуске</p>
            <div className="cta-buttons">
              <Link to="/early-access" className="btn btn-primary btn-large">
                🚀 Стать первым пользователем
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage