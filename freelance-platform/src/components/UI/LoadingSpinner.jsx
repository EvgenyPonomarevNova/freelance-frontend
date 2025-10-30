// src/components/UI/LoadingSpinner.jsx
import './LoadingSpinner.scss';

function LoadingSpinner({ 
  message = "Загрузка...", 
  size = "medium",
  overlay = false 
}) {
  return (
    <div className={`loading-container ${overlay ? 'overlay' : ''} ${size}`}>
      <div className="loading-spinner"></div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
}

export default LoadingSpinner;