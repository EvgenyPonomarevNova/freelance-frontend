import './SkillTag.scss'

function SkillTag({ skill, level = 'intermediate', onRemove, editable = false }) {
  const getLevelColor = () => {
    switch(level) {
      case 'beginner': return '#e74c3c'
      case 'intermediate': return '#f39c12'
      case 'advanced': return '#27ae60'
      case 'expert': return '#3498db'
      default: return '#667eea'
    }
  }

  const getLevelText = () => {
    switch(level) {
      case 'beginner': return 'Начальный'
      case 'intermediate': return 'Средний'
      case 'advanced': return 'Продвинутый'
      case 'expert': return 'Эксперт'
      default: return 'Средний'
    }
  }

  return (
    <div className="skill-tag">
      <span className="skill-name">{skill}</span>
      <div className="skill-level" style={{ backgroundColor: getLevelColor() }}>
        {getLevelText()}
      </div>
      {editable && (
        <button className="remove-skill" onClick={() => onRemove(skill)}>
          ×
        </button>
      )}
    </div>
  )
}

export default SkillTag