// components/ProjectViewModal/ProjectViewModal.jsx
import './ProjectViewModal.scss';

function ProjectViewModal({ project, isOpen, onClose, onEdit }) {
  if (!isOpen || !project) return null;

  const getStatusConfig = (status) => {
    const configs = {
      open: { text: '🔓 Открыт', color: '#10b981' },
      in_progress: { text: '⚡ В работе', color: '#3b82f6' },
      completed: { text: '✅ Завершен', color: '#6b7280' },
      cancelled: { text: '❌ Отменен', color: '#ef4444' }
    };
    return configs[status] || configs.open;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const statusConfig = getStatusConfig(project.status);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="project-view-modal" onClick={(e) => e.stopPropagation()}>
        {/* Заголовок модалки */}
        <div className="modal-header">
          <h2>👁️ Просмотр проекта</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          {/* Основная информация */}
          <div className="project-main-info">
            <div className="project-title-section">
              <h1>{project.title}</h1>
              <div 
                className="status-badge"
                style={{ backgroundColor: statusConfig.color }}
              >
                {statusConfig.text}
              </div>
            </div>

            <div className="project-meta-grid">
              <div className="meta-item">
                <span className="meta-label">💰 Бюджет</span>
                <span className="meta-value">{project.budget} ₽</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">🏷️ Категория</span>
                <span className="meta-value">{project.category}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">📅 Создан</span>
                <span className="meta-value">{formatDate(project.created_at)}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">💬 Откликов</span>
                <span className="meta-value">{project.responses?.length || 0}</span>
              </div>
            </div>
          </div>

          {/* Описание проекта */}
          <div className="project-description-section">
            <h3>📝 Описание проекта</h3>
            <div className="description-content">
              {project.description}
            </div>
          </div>

          {/* Детали проекта */}
          <div className="project-details-section">
            <h3>📋 Детали проекта</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Срок выполнения:</span>
                <span className="detail-value">{project.deadline || 'Не указан'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Уровень сложности:</span>
                <span className="detail-value">{project.difficulty || 'Не указан'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Тип работы:</span>
                <span className="detail-value">{project.work_type || 'Не указан'}</span>
              </div>
            </div>
          </div>

          {/* Навыки */}
          {project.skills && project.skills.length > 0 && (
            <div className="project-skills-section">
              <h3>🎯 Требуемые навыки</h3>
              <div className="skills-list">
                {project.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Отклики */}
          {project.responses && project.responses.length > 0 && (
            <div className="project-responses-section">
              <h3>💬 Отклики ({project.responses.length})</h3>
              <div className="responses-list">
                {project.responses.map((response, index) => (
                  <div key={index} className="response-card">
                    <div className="response-header">
                      <div className="freelancer-info">
                        <span className="freelancer-name">
                          👤 {response.freelancerName || 'Анонимный фрилансер'}
                        </span>
                        <span className="response-date">
                          📅 {formatDate(response.created_at || new Date())}
                        </span>
                      </div>
                      <div className="response-budget">
                        💰 {response.proposedBudget || 'Не указано'} ₽
                      </div>
                    </div>
                    {response.message && (
                      <div className="response-message">
                        "{response.message}"
                      </div>
                    )}
                    <div className="response-actions">
                      <button className="btn btn-success">✅ Принять</button>
                      <button className="btn btn-danger">❌ Отклонить</button>
                      <button className="btn btn-outline">💬 Написать</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Пустые отклики */}
          {(!project.responses || project.responses.length === 0) && (
            <div className="no-responses">
              <div className="no-responses-icon">💬</div>
              <p>Пока нет откликов на этот проект</p>
            </div>
          )}
        </div>

        {/* Футер модалки */}
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Закрыть
          </button>
          <button className="btn btn-primary" onClick={onEdit}>
            ✏️ Редактировать проект
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProjectViewModal;