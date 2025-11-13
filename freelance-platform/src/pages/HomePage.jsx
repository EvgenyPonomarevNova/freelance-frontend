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
    { value: '0%', label: 'Комиссия для первых клиентов' },
    { value: '20', label: 'Бесплатных подписок на ИИ осталось' },
    { value: '50+', label: 'Фрилансеров уже ждут запуска' }
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
      title: 'ИИ-помощник для идеального ТЗ',
      description: 'Наш встроенный ChatGPT поможет составить детальное и понятное техническое задание. Больше никаких "нужен сайт, как у Apple"!',
      icon: '🤖',
      feature: 'Умное ТЗ'
    },
    {
      step: '2',
      title: 'Находите подходящих исполнителей',
      description: 'Система автоматически рекомендует фрилансеров под задачи вашего проекта. Экономьте время на поиске.',
      icon: '🎯',
      feature: 'Умный подбор'
    },
    {
      step: '3',
      title: 'Работайте без лишних комиссий',
      description: 'Мы берем минимальную комиссию только для поддержки платформы. Ваши деньги остаются у вас.',
      icon: '💰',
      feature: 'Честная цена'
    }
  ]

  const advantages = [
    {
      icon: '🧠',
      title: 'ИИ-ассистент в каждом проекте',
      description: 'ChatGPT помогает и заказчику написать ТЗ, и фрилансеру — понять задачу и быстро дать качественный отклик.'
    },
    {
      icon: '💸',
      title: 'Комиссия только за результат',
      description: 'Мы не берем 20-30% как конкуренты. Наша комиссия — разумная и прозрачная. Для первых клиентов — 0%!'
    },
    {
      icon: '⚡',
      title: 'Экономьте время с двух сторон',
      description: 'Заказчики получают качественные ТЗ, фрилансеры — понятные задачи. Никакой пустой траты времени на уточнения.'
    },
    {
      icon: '🛡️',
      title: 'Безопасность и гарантии',
      description: 'Средства защищены системой безопасных платежей. Работайте спокойно, зная, что все под контролем.'
    }
  ]

  const testimonials = [
    {
      text: 'Наконец-то появится платформа, где не нужно гадать, что хочет заказчик. ИИ-помощник для ТЗ — это гениально!',
      author: 'Анна К.',
      role: 'UI/UX дизайнер',
      avatar: '👩‍🎨'
    },
    {
      text: 'Как заказчик, я тратил кучу времени на составление ТЗ. Теперь это будет делать ИИ — мечта!',
      author: 'Максим П.',
      role: 'Владелец бизнеса',
      avatar: '👨‍💼'
    }
  ]

  return (
    <div className="home-page">
      {/* Early Access Banner */}
      {showEarlyAccess && (
        <div className="early-access-banner">
          <div className="banner-content">
            <div className="banner-text">
              <span className="banner-badge">🚀 ЗАПУСКАЕМСЯ СКОРО</span>
              <h3>Станьте одним из первых на Smart-фриланс бирже!</h3>
              <p>Первым 20 клиентам — 0% комиссия и ИИ-помощник бесплатно на 3 месяца</p>
            </div>
            <div className="banner-actions">
              <Link to="/register" className="btn btn-primary">
                Получить привилегии первых
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
              <span className="construction-badge">🤖 УМНАЯ ФРИЛАНС-БИРЖА</span>
              <h1 className="hero-title">
                Устали от плохих ТЗ<br />
                и <span className="gradient-text">бешеных комиссий?</span>
              </h1>
            </div>
            <p className="hero-subtitle">
              FreelanceHab — первая биржа с ИИ-помощником. ChatGPT создает идеальные ТЗ, 
              а мы берем минимальную комиссию. Работайте эффективно, а не усердно.
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary">
                🤖 Получить ранний доступ
              </Link>
              <Link to="/how-it-works" className="btn btn-secondary">
                Узнать про ИИ-помощник
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
                <span className="avatar">🤖</span>
                <div className="user-info">
                  <strong>ИИ-помощник</strong>
                  <span>Создает ТЗ</span>
                </div>
              </div>
              <p>"Помогу составить детальное ТЗ для вашего проекта..."</p>
              <div className="card-badge ai-badge">AI Powered</div>
            </div>
            <div className="floating-card card-2">
              <div className="card-header">
                <span className="avatar">👨‍💼</span>
                <div className="user-info">
                  <strong>Заказчик</strong>
                  <span>Экономит 2 часа</span>
                </div>
              </div>
              <p>Раньше тратил 3 часа на ТЗ, теперь ИИ делает за 10 минут</p>
              <div className="card-budget">Комиссия 0%</div>
            </div>
            <div className="floating-card card-3">
              <div className="card-header">
                <span className="avatar">👩‍💻</span>
                <div className="user-info">
                  <strong>Фрилансер</strong>
                  <span>Понимает задачу</span>
                </div>
              </div>
              <p>Четкое ТЗ = меньше уточнений = больше проектов в срок</p>
              <div className="card-budget">Комиссия 5%</div>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="advantages-section">
        <div className="container">
          <h2 className="section-title">
            Почему FreelanceHab — это новая эра фриланса
          </h2>
          <div className="advantages-grid">
            {advantages.map((advantage, index) => (
              <div key={index} className="advantage-card">
                <div className="advantage-icon">{advantage.icon}</div>
                <h3>{advantage.title}</h3>
                <p>{advantage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <h2 className="section-title">Как работает умная биржа</h2>
          <div className="steps-grid">
            {howItWorks.map((step, index) => (
              <div key={index} className="step-card">
                <div className="step-badge">{step.feature}</div>
                <div className="step-number">{step.step}</div>
                <div className="step-icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-content">
            <div className="mission-text">
              <h2>Хватит терять время и деньги</h2>
              <p>
                Обычные фриланс-биржи зарабатывают на вашем недопонимании. 
                Чем хуже ТЗ — тем больше уточнений, тем дольше проект, тем больше комиссии они собирают.
              </p>
              <p>
                <strong>Мы ломаем эту систему.</strong> Наша миссия — сделать так, чтобы 
                заказчики и фрилансеры находили друг друга быстро и работали эффективно.
              </p>
              <div className="mission-highlight">
                <span className="highlight-icon">🎯</span>
                <div className="highlight-text">
                  <strong>Первым 20 клиентам:</strong> 0% комиссия + ИИ-помощник бесплатно на 3 месяца
                </div>
              </div>
            </div>
            <div className="mission-visual">
              <div className="comparison-card old-system">
                <h4>❌ Обычные биржи</h4>
                <ul>
                  <li>Комиссия 20-30%</li>
                  <li>Плохие ТЗ</li>
                  <li>Трата времени на уточнения</li>
                  <li>Недовольные обе стороны</li>
                </ul>
              </div>
              <div className="comparison-card our-system">
                <h4>✅ FreelanceHab</h4>
                <ul>
                  <li>Комиссия 5-10%</li>
                  <li>ИИ-помощник для ТЗ</li>
                  <li>Четкие задачи</li>
                  <li>Довольные клиенты и фрилансеры</li>
                </ul>
              </div>
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

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">Что говорят о нашей идее</h2>
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
            <h2>Готовы работать по-умному?</h2>
            <p>
              Присоединяйтесь к списку ожидания и получите 0% комиссию + 
              бесплатный доступ к ИИ-помощнику на 3 месяца
            </p>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary btn-large">
                🤖 Стать первым пользователем
              </Link>
            </div>
            <div className="cta-note">
              Только для первых 20 заказчиков
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage