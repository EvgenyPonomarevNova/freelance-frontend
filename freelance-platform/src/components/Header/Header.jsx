import "./Header.scss";

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <img src="/images/logo/logo.svg" alt="NexusHub" className="logo-img" />
        <h1>Nexus<span className="logo-accent">Hub</span></h1>
      </div>
      <nav className="nav">
        <a href="#projects">Проекты</a>
        <a href="#freelancers">Фрилансеры</a>
        <a href="#how-it-works">Как это работает</a>
      </nav>
      <div className="auth-buttons">
        <button className="login-btn">Войти</button>
        <button className="register-btn">Регистрация</button>
      </div>
    </header>
  );
}

export default Header;