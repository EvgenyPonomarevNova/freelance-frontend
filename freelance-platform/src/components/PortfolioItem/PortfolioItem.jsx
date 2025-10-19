import './PortfolioItem.scss'

function PortfolioItem({ item, onEdit, onDelete, editable = false }) {
  return (
    <div className="portfolio-item">
      <div className="portfolio-image">
        {item.image ? (
          <img src={item.image} alt={item.title} />
        ) : (
          <div className="image-placeholder">🎨</div>
        )}
      </div>
      
      <div className="portfolio-content">
        <h3 className="portfolio-title">{item.title}</h3>
        <p className="portfolio-description">{item.description}</p>
        
        <div className="portfolio-skills">
          {item.skills.map(skill => (
            <span key={skill} className="skill-badge">{skill}</span>
          ))}
        </div>
        
        <div className="portfolio-meta">
          <span className="portfolio-date">{item.date}</span>
          {item.link && (
            <a href={item.link} target="_blank" rel="noopener noreferrer" className="portfolio-link">
              Посмотреть проект
            </a>
          )}
        </div>
      </div>

      {editable && (
        <div className="portfolio-actions">
          <button className="edit-btn" onClick={() => onEdit(item)}>✏️</button>
          <button className="delete-btn" onClick={() => onDelete(item.id)}>🗑️</button>
        </div>
      )}
    </div>
  )
}

export default PortfolioItem