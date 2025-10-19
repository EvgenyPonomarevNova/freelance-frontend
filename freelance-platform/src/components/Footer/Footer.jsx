import './Footer.scss'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-logo">
        <h1><a href="#">💼 FreelanceHub </a> </h1>
      </div>
      <nav className="footer-nav">
        <a href="#">О проекте</a>
        <a href="#rules">Правила</a>
        <a href="#Safety">Безопасность</a>
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
  )
}
export default Footer