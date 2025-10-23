// pages/HowItWorksPage/HowItWorksPage.jsx
import './HowItWorksPage.scss'

function HowItWorksPage() {
  const steps = [
    {
      number: '01',
      title: 'Создайте аккаунт',
      description: 'Зарегистрируйтесь как заказчик или фрилансер',
      icon: '👤'
    },
    {
      number: '02',
      title: 'Найдите подходящий проект или исполнителя',
      description: 'Используйте фильтры и поиск для быстрого поиска',
      icon: '🔍'
    },
    {
      number: '03',
      title: 'Свяжитесь и обсудите детали',
      description: 'Используйте встроенный чат для общения',
      icon: '💬'
    },
    {
      number: '04',
      title: 'Начните сотрудничество',
      description: 'Договоритесь о сроках и приступайте к работе',
      icon: '🤝'
    },
    {
      number: '05',
      title: 'Завершите проект и получите оплату',
      description: 'Безопасная сделка через нашу платформу',
      icon: '💰'
    }
  ]

  const features = [
    {
      title: 'Безопасные сделки',
      description: 'Все платежи защищены системой escrow',
      icon: '🛡️'
    },
    {
      title: 'Рейтинговая система',
      description: 'Честные отзывы и рейтинги участников',
      icon: '⭐'
    },
    {
      title: 'Поддержка 24/7',
      description: 'Наша команда всегда готова помочь',
      icon: '🎯'
    }
  ]

  return (
    <div className="how-it-works-page">
      <div className="page-header">
        <h1>Как работает NexusHub</h1>
        <p>Простой и прозрачный процесс для эффективной работы</p>
      </div>

      <div className="steps-section">
        <h2>5 простых шагов к успешному сотрудничеству</h2>
        <div className="steps-grid">
          {steps.map((step, index) => (
            <div key={index} className="step-card">
              <div className="step-header">
                <span className="step-number">{step.number}</span>
                <div className="step-icon">{step.icon}</div>
              </div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="features-section">
        <h2>Почему выбирают NexusHub?</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="cta-section">
        <h2>Готовы начать?</h2>
        <p>Присоединяйтесь к тысячам успешных фрилансеров и заказчиков</p>
        <div className="cta-buttons">
          <button className="cta-btn primary">Найти проект</button>
          <button className="cta-btn secondary">Найти исполнителя</button>
        </div>
      </div>
    </div>
  )
}

export default HowItWorksPage