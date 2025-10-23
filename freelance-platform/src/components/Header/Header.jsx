import { Link } from 'react-router-dom'
import { useUser } from '../../contexts/UserContext'
import "./Header.scss";

function Header() {
  const { user, logout } = useUser()

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <img src="/images/logo/logo.svg" alt="NexusHub" className="logo-img" />
          <h1>Nexus<span className="logo-accent">Hub</span></h1>
        </Link>
      </div>

      <nav className="nav">
        <Link to="/projects" className="nav-link">Проекты</Link>
        <Link to="/freelancers" className="nav-link">Фрилансеры</Link>
        <Link to="/how-it-works" className="nav-link">Как это работает</Link>
      </nav>

      <div className="header-actions">
        {user ? (
          // Если пользователь авторизован
          <div className="user-section">
            {/* Кнопка создания проекта для заказчиков */}
            {user.role === 'client' && (
              <Link to="/create-project" className="create-project-btn">
                <span className="btn-icon">+</span>
                Создать проект
              </Link>
            )}
            
            {/* Меню пользователя */}
            <div className="user-menu">
              <Link to="/profile" className="profile-link">
                <span className="avatar">
                  {user.profile?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                </span>
                <span className="user-name">
                  {user.profile?.name || 'Пользователь'}
                </span>
              </Link>
              
              <div className="dropdown-menu">
                <Link to="/profile" className="dropdown-item">
                  👤 Мой профиль
                </Link>
                <Link to="/my-projects" className="dropdown-item">
                  💼 Мои проекты
                </Link>
                <Link to="/settings" className="dropdown-item">
                  ⚙️ Настройки
                </Link>
                <div className="dropdown-divider"></div>
                <button onClick={handleLogout} className="dropdown-item logout">
                  🚪 Выйти
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Если пользователь не авторизован
          <div className="auth-section">
            <Link to="/login" className="login-btn">Войти</Link>
            <Link to="/register" className="register-btn">Регистрация</Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;