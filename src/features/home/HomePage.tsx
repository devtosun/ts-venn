import { useNavigate } from 'react-router-dom';
import { useAuthState } from '../auth';
import { ProjectCard } from './components/ProjectCard';

const mockProjects = [
  {
    id: '1',
    title: 'Marketing Segments',
    description: 'Customer segmentation analysis',
    createdAt: '2 hours ago',
  },
  {
    id: '2',
    title: 'Product Features',
    description: 'Feature overlap visualization',
    createdAt: 'Yesterday',
  },
  {
    id: '3',
    title: 'Team Skills',
    description: 'Skill set comparison',
    createdAt: '3 days ago',
  },
];

export function HomePage() {
  const navigate = useNavigate();
  const user = useAuthState((s) => s.user);
  const logout = useAuthState((s) => s.logout);

  const handleNewProject = () => {
    navigate('/editor');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="home-page">
      <header className="home-header">
        <h1>ts-venn</h1>
        <div className="user-menu">
          <span>{user?.name}</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <main className="home-content">
        <div className="home-actions">
          <h2>Your Projects</h2>
          <button onClick={handleNewProject} className="new-project-btn">
            + New Venn Diagram
          </button>
        </div>

        <div className="projects-grid">
          {mockProjects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              description={project.description}
              createdAt={project.createdAt}
              onClick={handleNewProject}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
