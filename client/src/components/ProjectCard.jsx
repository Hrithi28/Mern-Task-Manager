export default function ProjectCard({ project, onClick }) {
  return (
    <div className="project-card" style={{ '--project-color': project.color }} onClick={onClick}>
      <h3 className="project-card-name">{project.name}</h3>
      {project.description && (
        <p className="project-card-desc">{project.description}</p>
      )}
      <div className="project-card-footer">
        <div className="project-stats">
          <div className="project-stat">Tasks: <span>{project.taskCount || 0}</span></div>
        </div>
      </div>
    </div>
  );
}
