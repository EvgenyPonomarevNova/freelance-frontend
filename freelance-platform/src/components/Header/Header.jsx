import "./Header.scss";
import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <img src="/images/logo/logo.svg" alt="NexusHub" className="logo-img" />
        <h1>
          Freelance<span className="logo-accent">Hub</span>
        </h1>
      </div>
      <nav className="nav">
        <Link to="/projects">Проекты</Link>
        <Link to="/freelancers">Фрилансеры</Link>
        <Link to="/how-it-works">Как это работает</Link>
      </nav>
      <div className="auth-buttons">
        <button className="login-btn">Войти</button>
        <Link to="/register" className="register-btn">Регистрация</Link>
      </div>
    </header>
  );
}

export default Header;
