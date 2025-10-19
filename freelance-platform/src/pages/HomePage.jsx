import './HomePage.scss'

function HomePage() {
  return (
    <div className="home-page">
      
      {/* Герой-секция */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="logo-title">
            <img src="/images/logo/logo.svg" alt="NexusHub" className="hero-logo" />
            <h1 className="hero-title">
              Nexus<span className="title-accent">Hub</span>
            </h1>
          </div>
          <p className="hero-tagline">Фриланс-платформа нового поколения</p>
          <p className="hero-description">
            Современная биржа для поиска исполнителей и заказчиков. 
            Быстро, безопасно и удобно.
          </p>
          <div className="hero-actions">
            <button className="btn-primary">Разместить проект</button>
            <button className="btn-secondary">Найти работу</button>
          </div>
        </div>
        
        <div className="hero-stats">
          <div className="stat-item">
            <div className="stat-number">500+</div>
            <div className="stat-label">активных проектов</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">1,200+</div>
            <div className="stat-label">исполнителей</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">95%</div>
            <div className="stat-label">успешных сделок</div>
          </div>
        </div>
      </section>

      {/* Секция категорий */}
      <section className="categories-section">
        <h2 className="section-title">
          Популярные <span className="title-accent">категории</span>
        </h2>
        <div className="categories-grid">
          <div className="category-card">
            <div className="card-icon">💻</div>
            <h3>Разработка</h3>
            <p>Веб и мобильные приложения</p>
            <span className="project-count">245 проектов</span>
          </div>
          <div className="category-card">
            <div className="card-icon">🎨</div>
            <h3>Дизайн</h3>
            <p>UI/UX, графика, брендинг</p>
            <span className="project-count">189 проектов</span>
          </div>
          <div className="category-card">
            <div className="card-icon">📝</div>
            <h3>Тексты</h3>
            <p>Копирайтинг, переводы</p>
            <span className="project-count">156 проектов</span>
          </div>
          <div className="category-card">
            <div className="card-icon">📊</div>
            <h3>Маркетинг</h3>
            <p>SEO, SMM, аналитика</p>
            <span className="project-count">98 проектов</span>
          </div>
        </div>
      </section>

      {/* Как это работает */}
      <section className="how-it-works-section">
        <h2 className="section-title">
          Как это <span className="title-accent">работает</span>
        </h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Разместите задачу</h3>
            <p>Опишите ваш проект, установите бюджет и сроки выполнения</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Получите отклики</h3>
            <p>Исполнители предложат свои услуги и цены</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Выберите исполнителя</h3>
            <p>Просмотрите портфолио и отзывы, чтобы сделать выбор</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Оплатите безопасно</h3>
            <p>Система гарантирует выполнение работы и защиту платежа</p>
          </div>
        </div>
      </section>

      {/* Преимущества */}
      <section className="benefits-section">
        <h2 className="section-title">
          Почему выбирают <span className="title-accent">NexusHub</span>
        </h2>
        <div className="benefits-grid">
          <div className="benefit-item">
            <div className="benefit-icon">🛡️</div>
            <h3>Безопасная сделка</h3>
            <p>Ваши платежи защищены, работа проверяется перед оплатой</p>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">⚡</div>
            <h3>Быстрый старт</h3>
            <p>Начните работу уже через 5 минут после регистрации</p>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">👥</div>
            <h3>Проверенные исполнители</h3>
            <p>Все фрилансеры проходят верификацию и имеют рейтинг</p>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">💬</div>
            <h3>Поддержка 24/7</h3>
            <p>Наша команда поможет решить любые вопросы</p>
          </div>
        </div>
      </section>

    </div>
  )
}

export default HomePage