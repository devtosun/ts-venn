interface ProjectCardProps {
  title: string;
  description: string;
  createdAt: string;
  onClick: () => void;
}

export function ProjectCard({ title, description, createdAt, onClick }: ProjectCardProps) {
  return (
    <div className="project-card" onClick={onClick}>
      <div className="project-card-preview">
        <svg viewBox="0 0 100 80">
          <circle cx="35" cy="40" r="25" fill="rgba(59, 130, 246, 0.3)" stroke="#3b82f6" strokeWidth="1" />
          <circle cx="65" cy="40" r="25" fill="rgba(239, 68, 68, 0.3)" stroke="#ef4444" strokeWidth="1" />
        </svg>
      </div>
      <div className="project-card-content">
        <h3>{title}</h3>
        <p>{description}</p>
        <span className="project-card-date">{createdAt}</span>
      </div>
    </div>
  );
}
