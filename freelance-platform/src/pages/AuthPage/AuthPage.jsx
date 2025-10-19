import './AuthPage.scss'
import RegisterForm from '../../components/RegisterForm/RegisterForm'

function AuthPage() {
  const handleRegisterSuccess = () => {
    // Здесь будет редирект или уведомление об успешной регистрации
    console.log('Регистрация успешна!')
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-hero">
          <h1>Начните свой путь в <span className="accent">фрилансе</span></h1>
          <p>
            Присоединяйтесь к сообществу профессионалов. 
            Находите интересные проекты или надежных исполнителей.
          </p>
          <div className="hero-features">
            <div className="feature">
              <span className="feature-icon">🚀</span>
              <span>Быстрый старт</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🛡️</span>
              <span>Безопасные сделки</span>
            </div>
            <div className="feature">
              <span className="feature-icon">👥</span>
              <span>Проверенное сообщество</span>
            </div>
          </div>
        </div>

        <div className="auth-form-section">
          <RegisterForm onSuccess={handleRegisterSuccess} />
        </div>
      </div>
    </div>
  )
}

export default AuthPage