import "./Footer.scss";

function Footer() {
  return (
    <footer className="footer">
      <div className="logo">
        <img src="/images/logo/logo.svg" alt="NexusHub" className="logo-img" />
        <h1>Nexus<span className="logo-accent">Hub</span></h1>
      </div>
      <nav className="footer-nav">
        <a href="#">О проекте</a>
        <a href="#rules">Правила</a>
        <a href="#safety">Безопасность</a>
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