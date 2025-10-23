import { Link } from 'react-router-dom'
import "./Footer.scss";

function Footer() {
  return (
    <footer className="footer">
      <div className="logo">
        <img src="/images/logo/logo.svg" alt="NexusHub" className="logo-img" />
        <h1>Freelance<span className="logo-accent">Hub</span></h1>
      </div>
      <nav className="footer-nav">
        <Link to="/about">О проекте</Link>
        <Link to="/rules">Правила</Link>
        <Link to="/safety">Безопасность</Link>
      </nav>
      <div className="partners">
        <div className="partner-item">
          <img src="/images/start-logo.svg" alt="Start" />
        </div>
        <div className="partner-item">
          <img src="/images/sber-logo-eng.svg" alt="Sber" />
        </div>
      </div>
    </footer>
  );
}

export default Footer;