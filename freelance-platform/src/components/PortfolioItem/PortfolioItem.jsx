// src/components/PortfolioItem/PortfolioItem.jsx
import "./PortfolioItem.scss";

function PortfolioItem({ item, onRemove, editable = false }) {
  return (
    <div className="portfolio-item">
      <div className="portfolio-header">
        <div className="portfolio-info">
          <h3 className="portfolio-title">{item.title}</h3>
          <span className="portfolio-date">{item.date}</span>
        </div>
        {editable && (
          <button 
            className="remove-portfolio-btn"
            onClick={() => onRemove(item.id)}
            title="Удалить проект"
          >
            ❌
          </button>
        )}
      </div>
      
      {item.image && (
        <div className="portfolio-image">
          <img src={item.image} alt={item.title} />
        </div>
      )}
      
      <p className="portfolio-description">{item.description}</p>
      
      <div className="portfolio-details">
        {item.duration && (
          <span className="detail">⏱️ {item.duration}</span>
        )}
        {item.budget && (
          <span className="detail">💰 {item.budget} ₽</span>
        )}
        {item.category && (
          <span className="detail">📁 {item.category}</span>
        )}
      </div>
      
      {item.link && (
        <a 
          href={item.link} 
          className="portfolio-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          🔗 Посмотреть проект
        </a>
      )}
    </div>
  );
}

export default PortfolioItem;