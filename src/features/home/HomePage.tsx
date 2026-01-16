import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, User } from 'lucide-react';
import { useAuthState } from '../auth';
import { ProjectCard } from './components/ProjectCard';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

  const getInitials = (name: string) => {
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-card">
        <div className="container mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold text-primary">ts-venn</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.name ? getInitials(user.name) : <User className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold">Your Projects</h2>
          <Button onClick={handleNewProject} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            New Venn Diagram
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
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
