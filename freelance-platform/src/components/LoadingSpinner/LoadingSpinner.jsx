// src/components/UI/LoadingSpinner.jsx
import "./LoadingSpinner.scss";

function LoadingSpinner({ message = "Загрузка..." }) {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p className="loading-text">{message}</p>
    </div>
  );
}

export default LoadingSpinner;