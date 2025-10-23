// pages/HomePage/HomePage.jsx
import './HomePage.scss'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function HomePage() {
  const [stats, setStats] = useState([
    { value: '50M+', label: 'Зарегистрированных пользователей' },
    { value: '25M+', label: 'Выполненных проектов' },
    { value: '₽150B+', label: 'Выплачено фрилансерам' }
  ])

  const categories = [
    { icon: '💻', name: 'Разработка', count: '245k проектов' },
    { icon: '🎨', name: 'Дизайн', count: '180k проектов' },
    { icon: '📝', name: 'Тексты', count: '95k проектов' },
    { icon: '📊', name: 'Маркетинг', count: '120k проектов' },
    { icon: '🔍', name: 'SEO', count: '65k проектов' },
    { icon: '📱', name: 'Мобильные приложения', count: '85k проектов' }
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
      text: 'NexusHub изменил мой подход к найму. Теперь я нахожу талантливых специалистов за несколько часов, а не недель.',
      author: 'Анна Петрова',
      role: 'CEO, TechStart',
      avatar: '👩‍💼'
    },
    {
      text: 'Как фрилансер, я нашел стабильный поток интересных проектов. Платформа действительно работает!',
      author: 'Иван Сидоров',
      role: 'Fullstack разработчик',
      avatar: '👨‍💻'
    }
  ]

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Наймите лучших<br />
              <span className="gradient-text">фрилансеров</span><br />
              для любого проекта
            </h1>
            <p className="hero-subtitle">
              Присоединяйтесь к миллионам людей, использующих NexusHub для превращения своих идей в реальность
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary">
                Начать сейчас
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
                  <strong>Маркетолог</strong>
                  <span>⭐ 4.9 (127 отзывов)</span>
                </div>
              </div>
              <p>Нужен SMM специалист для продвижения бренда...</p>
              <div className="card-budget">Бюджет: ₽15,000 - ₽30,000</div>
            </div>
            <div className="floating-card card-2">
              <div className="card-header">
                <span className="avatar">👩‍🎨</span>
                <div className="user-info">
                  <strong>Дизайнер UI/UX</strong>
                  <span>⭐ 5.0 (89 отзывов)</span>
                </div>
              </div>
              <p>Создание современного дизайна для мобильного приложения...</p>
              <div className="card-budget">Бюджет: ₽25,000 - ₽50,000</div>
            </div>
            <div className="floating-card card-3">
              <div className="card-header">
                <span className="avatar">👨‍💻</span>
                <div className="user-info">
                  <strong>React разработчик</strong>
                  <span>⭐ 4.8 (204 отзыва)</span>
                </div>
              </div>
              <p>Разработка корпоративного портала на React...</p>
              <div className="card-budget">Бюджет: ₽50,000 - ₽100,000</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Популярные категории</h2>
          <div className="categories-grid">
            {categories.map((category, index) => (
              <div key={index} className="category-card">
                <div className="category-icon">{category.icon}</div>
                <h3>{category.name}</h3>
                <p>{category.count}</p>
                <Link to="/projects" className="category-link">
                  Найти специалистов →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <h2 className="section-title">Как работает NexusHub</h2>
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
          <h2 className="section-title">Что говорят наши пользователи</h2>
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
            <h2>Готовы начать?</h2>
            <p>Присоединяйтесь к NexusHub сегодня и откройте новые возможности</p>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary btn-large">
                Создать аккаунт
              </Link>
              <Link to="/projects" className="btn btn-secondary btn-large">
                Найти проекты
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage