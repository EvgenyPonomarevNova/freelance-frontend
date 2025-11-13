// components/Header/Header.jsx
import { Link } from 'react-router-dom'
import { useUser } from '../../contexts/UserContext'
import "./Header.scss";

function Header() {
  const { user, logout } = useUser()

  const handleLogout = () => {
    logout()
  }

  // Функция для получения аватара пользователя
  const getUserAvatar = () => {
    if (user?.profile?.avatar) {
      return user.profile.avatar;
    }
    return null;
  };

  // Функция для отображения аватара или инициалов
  const renderAvatar = () => {
    const avatar = getUserAvatar();
    
    if (avatar) {
      return (
        <img 
          src={avatar} 
          alt={user.profile?.name || 'Пользователь'} 
          className="avatar-img"
        />
      );
    } else {
      // Показываем инициалы если нет аватара
      const initials = user.profile?.name
        ?.split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase() || 'U';
      
      return (
        <div className="avatar-initials">
          {initials}
        </div>
      );
    }
  };

  // Функция для получения названия сайта в зависимости от роли
  const getSiteName = () => {
    if (user?.role === 'freelancer') {
      return (
        <>
          Freelance<span className="logo-accent">Hub</span>
        </>
      );
    }
    return (
      <>
        Freelance<span className="logo-accent">Hub</span>
      </>
    );
  };

  // Функция для рендеринга навигации в зависимости от роли
  const renderNavigation = () => {
    const commonLinks = [
      { to: "/projects", label: "Проекты" },
      { to: "/chats", label: "Чаты" },
      { to: "/how-it-works", label: "Как это работает" }
    ];

    if (user?.role === 'freelancer') {
      return (
        <>
          {commonLinks.map(link => (
            <Link key={link.to} to={link.to} className="nav-link">
              {link.label}
            </Link>
          ))}
          <Link to="/my-responses" className="nav-link">
            Мои отклики
          </Link>
        </>
      );
    } else if (user?.role === 'client') {
      return (
        <>
          {commonLinks.map(link => (
            <Link key={link.to} to={link.to} className="nav-link">
              {link.label}
            </Link>
          ))}
          <Link to="/freelancers" className="nav-link">
            Фрилансеры
          </Link>
        </>
      );
    } else {
      // Для неавторизованных пользователей
      return (
        <>
          <Link to="/projects" className="nav-link">Проекты</Link>
          <Link to="/freelancers" className="nav-link">Фрилансеры</Link>
          <Link to="/chats" className="nav-link">Чаты</Link>
          <Link to="/how-it-works" className="nav-link">Как это работает</Link>
        </>
      );
    }
  };

  // Функция для рендеринга выпадающего меню пользователя
  const renderUserDropdown = () => {
    const commonItems = [
      { to: "/profile", label: "👤 Мой профиль", icon: "👤" },
      { to: "/chats", label: "💬 Мои чаты", icon: "💬" },
      { to: "/settings", label: "⚙️ Настройки", icon: "⚙️" }
    ];

    if (user?.role === 'freelancer') {
      return (
        <div className="dropdown-menu">
          {commonItems.map(item => (
            <Link key={item.to} to={item.to} className="dropdown-item">
              {item.label}
            </Link>
          ))}
          <Link to="/my-responses" className="dropdown-item">
            Мои отклики
          </Link>
          <div className="dropdown-divider"></div>
          <button onClick={handleLogout} className="dropdown-item logout">
            🚪 Выйти
          </button>
        </div>
      );
    } else if (user?.role === 'client') {
      return (
        <div className="dropdown-menu">
          {commonItems.map(item => (
            <Link key={item.to} to={item.to} className="dropdown-item">
              {item.label}
            </Link>
          ))}
          <Link to="/my-projects" className="dropdown-item">
            💼 Мои проекты
          </Link>
          <div className="dropdown-divider"></div>
          <button onClick={handleLogout} className="dropdown-item logout">
            🚪 Выйти
          </button>
        </div>
      );
    }
  };

  // Функция для рендеринга кнопок действий в зависимости от роли
  const renderActionButtons = () => {
    if (user?.role === 'client') {
      return (
        <Link to="/create-project" className="create-project-btn">
          <span className="btn-icon">+</span>
          Создать проект
        </Link>
      );
    } else if (user?.role === 'freelancer') {
      return (
        <Link to="/projects" className="find-projects-btn">
          Найти проекты
        </Link>
      );
    }
    return null;
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <img src="/images/logo/logo.svg" alt={user?.role === 'freelancer' ? 'FreelanceHub' : 'NexusHub'} className="logo-img" />
          <h1>{getSiteName()}</h1>
        </Link>
      </div>

      <nav className="nav">
        {renderNavigation()}
      </nav>

      <div className="header-actions">
        {user ? (
          // Если пользователь авторизован
          <div className="user-section">
            {/* Кнопки действий в зависимости от роли */}
            {renderActionButtons()}
            
            {/* Меню пользователя */}
            <div className="user-menu">
              <Link to="/profile" className="profile-link">
                <span className="avatar">
                  {renderAvatar()}
                </span>
                <span className="user-name">
                  {user.profile?.name || 'Пользователь'}
                </span>
              </Link>
              
              {renderUserDropdown()}
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