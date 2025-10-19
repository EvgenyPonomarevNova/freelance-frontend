import './SafetyPage.scss'

function SafetyPage() {
  return (
    <div className="safety-page">
      <div className="page-header">
        <h1 className="page-title">
          Безопасность <span className="title-accent">сделок</span>
        </h1>
        <p className="page-subtitle">Как мы защищаем ваши платежи и данные</p>
      </div>

      <div className="safety-content">
        <section className="safety-section">
          <h2>🛡️ Защита платежей</h2>
          <div className="safety-features">
            <div className="feature">
              <div className="feature-icon">💳</div>
              <div className="feature-text">
                <h3>Безопасная оплата</h3>
                <p>Все платежи проходят через защищенные платежные системы с шифрованием данных</p>
              </div>
            </div>
            <div className="feature">
              <div className="feature-icon">🔒</div>
              <div className="feature-text">
                <h3>Эскроу-счета</h3>
                <p>Деньги хранятся на защищенном счете до успешного выполнения работы</p>
              </div>
            </div>
            <div className="feature">
              <div className="feature-icon">⚖️</div>
              <div className="feature-text">
                <h3>Арбитраж</h3>
                <p>В случае споров наши модераторы помогут найти справедливое решение</p>
              </div>
            </div>
          </div>
        </section>

        <section className="safety-section">
          <h2>🔐 Защита данных</h2>
          <div className="privacy-features">
            <div className="privacy-item">
              <h3>Шифрование</h3>
              <p>Все данные передаются по защищенным SSL-соединениям</p>
            </div>
            <div className="privacy-item">
              <h3>Конфиденциальность</h3>
              <p>Мы не передаем ваши персональные данные третьим лицам</p>
            </div>
            <div className="privacy-item">
              <h3>Резервное копирование</h3>
              <p>Регулярное резервное копирование обеспечивает сохранность данных</p>
            </div>
          </div>
        </section>

        <section className="safety-section tips">
          <h2>💡 Советы по безопасности</h2>
          <div className="tips-grid">
            <div className="tip-card">
              <h3>Для заказчиков</h3>
              <ul>
                <li>Проверяйте рейтинг и отзывы исполнителя</li>
                <li>Составляйте четкое техническое задание</li>
                <li>Используйте встроенную систему сообщений</li>
                <li>Оплачивайте работу только после приемки</li>
              </ul>
            </div>
            <div className="tip-card">
              <h3>Для исполнителей</h3>
              <ul>
                <li>Не переходите на внешние мессенджеры</li>
                <li>Сохраняйте всю переписку на платформе</li>
                <li>Фиксируйте этапы работы скриншотами</li>
                <li>Используйте официальные каналы оплаты</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="safety-section support">
          <h2>🆘 Поддержка</h2>
          <p>
            Если у вас возникли проблемы или подозрения о мошенничестве, 
            немедленно свяжитесь с нашей службой поддержки. Мы работаем 24/7 
            и готовы помочь в любой ситуации.
          </p>
          <button className="support-btn">Связаться с поддержкой</button>
        </section>
      </div>
    </div>
  )
}

export default SafetyPage