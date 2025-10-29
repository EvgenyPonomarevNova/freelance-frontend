// pages/HowItWorksPage/HowItWorksPage.jsx
import './HowItWorksPage.scss'
import { useUser } from '../../contexts/UserContext'
import { useNavigate } from 'react-router-dom'

function HowItWorksPage() {
  const { user } = useUser()
  const navigate = useNavigate()

  const steps = [
    {
      number: '01',
      title: 'Создайте аккаунт',
      description: 'Зарегистрируйтесь как заказчик или фрилансер',
      icon: '👤'
    },
    {
      number: '02',
      title: user?.role === 'client' ? 'Найдите исполнителя' : 'Найдите подходящий проект',
      description: user?.role === 'client' 
        ? 'Используйте фильтры для поиска квалифицированных фрилансеров' 
        : 'Используйте фильтры и поиск для быстрого поиска проектов',
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

  const handleFindProject = () => {
    navigate('/projects')
  }

  const handleFindFreelancer = () => {
    navigate('/freelancers')
  }

  const handleRegister = () => {
    navigate('/register')
  }

  // Определяем текст и кнопки в зависимости от роли пользователя
  const getCtaContent = () => {
    if (!user) {
      return {
        title: 'Готовы начать?',
        description: 'Присоединяйтесь к тысячам успешных фрилансеров и заказчиков',
        buttons: [
          { text: 'Зарегистрироваться', onClick: handleRegister, type: 'primary' },
          { text: 'Узнать больше', onClick: () => navigate('/about'), type: 'secondary' }
        ]
      }
    }

    if (user.role === 'client') {
      return {
        title: 'Найдите идеального исполнителя',
        description: 'Начните сотрудничество с квалифицированными фрилансерами',
        buttons: [
          { text: 'Найти исполнителя', onClick: handleFindFreelancer, type: 'primary' },
          { text: 'Создать проект', onClick: () => navigate('/create-project'), type: 'secondary' }
        ]
      }
    }

    // Для фрилансеров
    return {
      title: 'Найдите интересные проекты',
      description: 'Начните зарабатывать на любимом деле',
      buttons: [
        { text: 'Найти проект', onClick: handleFindProject, type: 'primary' },
        { text: 'Пополнить портфолио', onClick: () => navigate('/profile'), type: 'secondary' }
      ]
    }
  }

  const ctaContent = getCtaContent()

  return (
    <div className="how-it-works-page">
      <div className="page-header">
        <h1>Как работает FreelanceHub</h1>
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
        <h2>Почему выбирают FreelanceHub?</h2>
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
        <h2>{ctaContent.title}</h2>
        <p>{ctaContent.description}</p>
        <div className="cta-buttons">
          {ctaContent.buttons.map((button, index) => (
            <button
              key={index}
              className={`cta-btn ${button.type}`}
              onClick={button.onClick}
            >
              {button.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HowItWorksPage