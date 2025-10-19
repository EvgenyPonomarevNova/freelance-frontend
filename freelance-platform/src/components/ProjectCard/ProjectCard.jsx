import './ProjectCard.scss'

function ProjectCard({ project }) {
  return (
    <div className="project-card">
      <div className="project-header">
        <h3 className="project-title">{project.title}</h3>
        <span className="project-budget">{project.budget} ₽</span>
      </div>
      
      <p className="project-description">{project.description}</p>
      
      <div className="project-skills">
        {project.skills.map(skill => (
          <span key={skill} className="skill-tag">{skill}</span>
        ))}
      </div>
      
      <div className="project-footer">
        <span className="project-date">{project.createdAt}</span>
        <button className="respond-btn">Откликнуться</button>
      </div>
    </div>
  )
}

export default ProjectCard