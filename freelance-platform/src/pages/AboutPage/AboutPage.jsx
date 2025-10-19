import './AboutPage.scss'

function AboutPage() {
  return (
    <div className="about-page">
      <div className="page-header">
        <h1 className="page-title">
          О <span className="title-accent">проекте</span>
        </h1>
        <p className="page-subtitle">Узнайте больше о нашей платформе</p>
      </div>

      <div className="about-content">
        <section className="about-section">
          <h2>Что такое NexusHub?</h2>
          <p>
            NexusHub — это современная фриланс-платформа, созданная для соединения талантливых 
            специалистов и клиентов, нуждающихся в качественных услугах. Мы стремимся сделать 
            процесс collaboration максимально простым, безопасным и эффективным.
          </p>
        </section>

        <section className="about-section">
          <h2>Наша миссия</h2>
          <p>
            Мы верим, что каждый специалист заслуживает возможность работать над интересными 
            проектами, а каждый клиент — находить идеальных исполнителей для своих задач. 
            Наша платформа разрушает географические барьеры и создает сообщество профессионалов.
          </p>
        </section>

        <section className="about-section">
          <h2>Преимущества платформы</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Быстрый старт</h3>
              <p>Начните работу уже через 5 минут после регистрации</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Безопасность</h3>
              <p>Система гарантирует защиту платежей и качество работ</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Сообщество</h3>
              <p>Присоединяйтесь к тысячам профессионалов в разных сферах</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💼</div>
              <h3>Разнообразие</h3>
              <p>Проекты любой сложности от малого бизнеса до корпораций</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Команда проекта</h2>
          <p>
            NexusHub создается командой энтузиастов, которые сами прошли путь фрилансеров 
            и понимают все боли и потребности рынка. Мы постоянно работаем над улучшением 
            платформы и добавлением новых функций.
          </p>
        </section>
      </div>
    </div>
  )
}

export default AboutPage