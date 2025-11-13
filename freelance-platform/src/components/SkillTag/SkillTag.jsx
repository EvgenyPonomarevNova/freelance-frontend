// src/components/SkillTag/SkillTag.jsx
import "./SkillTag.scss";

function SkillTag({ skill, level, onRemove, editable = false }) {
  const getLevelColor = (level) => {
    const colors = {
      beginner: "#e53e3e",
      intermediate: "#dd6b20", 
      advanced: "#38a169",
      expert: "#3182ce"
    };
    return colors[level] || colors.beginner;
  };

  const getLevelText = (level) => {
    const texts = {
      beginner: "Начальный",
      intermediate: "Средний",
      advanced: "Продвинутый",
      expert: "Эксперт"
    };
    return texts[level] || texts.beginner;
  };

  return (
    <div className="skill-tag">
      <span className="skill-name">{skill}</span>
      <span 
        className="skill-level"
        style={{ 
          backgroundColor: getLevelColor(level),
          color: 'white'
        }}
      >
        {getLevelText(level)}
      </span>
      {editable && (
        <button 
          className="remove-skill-btn"
          onClick={() => onRemove(skill)}
          title="Удалить навык"
        >
          ×
        </button>
      )}
    </div>
  );
}

export default SkillTag;