// src/components/UI/EmptyState.jsx
import './EmptyState.scss';

function EmptyState({ 
  icon = "📋",
  title = "Данные не найдены",
  description = "Здесь пока ничего нет",
  action = null 
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <h3 className="empty-title">{title}</h3>
      <p className="empty-description">{description}</p>
      {action && (
        <div className="empty-action">
          {action}
        </div>
      )}
    </div>
  );
}

export default EmptyState;