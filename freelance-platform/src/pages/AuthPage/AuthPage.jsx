import './AuthPage.scss'
import RegisterForm from '../../components/RegisterForm/RegisterForm'
import LoginForm from '../../components/LoginForm/LoginForm'
import { useLocation } from 'react-router-dom'

function AuthPage() {
  const location = useLocation()
  const isLogin = location.pathname === '/login'

  const handleAuthSuccess = () => {
    console.log(`${isLogin ? 'Вход' : 'Регистрация'} успешна!`)
    // Здесь будет редирект
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-hero">
          <h1>
            {isLogin ? 'С возвращением!' : 'Начните свой путь в '}
            {!isLogin && <span className="accent">фрилансе</span>}
          </h1>
          <p>
            {isLogin 
              ? 'Войдите в свой аккаунт чтобы продолжить работу' 
              : 'Присоединяйтесь к сообществу профессионалов. Находите интересные проекты или надежных исполнителей.'
            }
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
          {isLogin ? (
            <LoginForm onSuccess={handleAuthSuccess} />
          ) : (
            <RegisterForm onSuccess={handleAuthSuccess} />
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthPage