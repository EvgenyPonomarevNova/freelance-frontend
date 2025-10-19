import './RulesPage.scss'

function RulesPage() {
  return (
    <div className="rules-page">
      <div className="page-header">
        <h1 className="page-title">
          Правила <span className="title-accent">платформы</span>
        </h1>
        <p className="page-subtitle">Ознакомьтесь с правилами использования сервиса</p>
      </div>

      <div className="rules-content">
        <section className="rules-section">
          <h2>Общие положения</h2>
          <div className="rules-list">
            <div className="rule-item">
              <h3>1.1 Регистрация</h3>
              <p>Для использования платформы необходима регистрация с предоставлением достоверной информации.</p>
            </div>
            <div className="rule-item">
              <h3>1.2 Возрастные ограничения</h3>
              <p>Пользователь должен быть старше 18 лет или иметь согласие родителей/опекунов.</p>
            </div>
            <div className="rule-item">
              <h3>1.3 Ответственность</h3>
              <p>Пользователь несет ответственность за достоверность размещаемой информации.</p>
            </div>
          </div>
        </section>

        <section className="rules-section">
          <h2>Для заказчиков</h2>
          <div className="rules-list">
            <div className="rule-item">
              <h3>2.1 Размещение проектов</h3>
              <p>Заказчик обязуется предоставлять четкое и подробное техническое задание.</p>
            </div>
            <div className="rule-item">
              <h3>2.2 Оплата</h3>
              <p>Оплата производится через защищенную систему после принятия работы.</p>
            </div>
            <div className="rule-item">
              <h3>2.3 Коммуникация</h3>
              <p>Своевременная обратная связь и обсуждение деталей проекта обязательны.</p>
            </div>
          </div>
        </section>

        <section className="rules-section">
          <h2>Для фрилансеров</h2>
          <div className="rules-list">
            <div className="rule-item">
              <h3>3.1 Качество работ</h3>
              <p>Исполнитель гарантирует качественное выполнение работ в установленные сроки.</p>
            </div>
            <div className="rule-item">
              <h3>3.2 Отклики</h3>
              <p>Откликаться следует только на проекты, соответствующие вашей компетенции.</p>
            </div>
            <div className="rule-item">
              <h3>3.3 Конфиденциальность</h3>
              <p>Запрещено разглашать конфиденциальную информацию заказчика.</p>
            </div>
          </div>
        </section>

        <section className="rules-section warning">
          <h2>⚠️ Запрещенные действия</h2>
          <ul className="prohibited-list">
            <li>Мошенничество и обман пользователей</li>
            <li>Размещение запрещенного контента</li>
            <li>Нецензурная лексика и оскорбления</li>
            <li>Попытки обойти систему безопасности</li>
            <li>Нарушение авторских прав</li>
          </ul>
        </section>
      </div>
    </div>
  )
}

export default RulesPage