import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, User, Layers, Trash2, CircleDot } from 'lucide-react';
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
import { diagramStorage } from '@/services/storage';
import type { SavedDiagram } from '@/services/storage/types';

export function HomePage() {
  const navigate = useNavigate();
  const user = useAuthState((s) => s.user);
  const logout = useAuthState((s) => s.logout);

  const [diagrams, setDiagrams] = useState<SavedDiagram[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDiagrams();
  }, []);

  const loadDiagrams = async () => {
    setLoading(true);
    try {
      const data = await diagramStorage.getAll();
      setDiagrams(data);
    } finally {
      setLoading(false);
    }
  };

  const handleNewProject = () => {
    navigate('/editor');
  };

  const handleOpenDiagram = (id: string) => {
    navigate(`/editor/${id}`);
  };

  const handleDeleteDiagram = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await diagramStorage.delete(id);
    await loadDiagrams();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name: string) => {
    return name.slice(0, 2).toUpperCase();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) return 'Az once';
    if (hours < 24) return `${hours} saat once`;
    if (days === 1) return 'Dun';
    if (days < 7) return `${days} gun once`;
    return date.toLocaleDateString('tr-TR');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-card">
        <div className="container mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold text-primary">ts-venn</h1>
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/elements')}
              className="hidden sm:flex"
            >
              <Layers className="mr-2 h-4 w-4" />
              Elementler
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/segments')}
              className="hidden sm:flex"
            >
              <CircleDot className="mr-2 h-4 w-4" />
              Segmentler
            </Button>
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
                <DropdownMenuItem onClick={() => navigate('/elements')} className="cursor-pointer sm:hidden">
                  <Layers className="mr-2 h-4 w-4" />
                  <span>Elementler</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/segments')} className="cursor-pointer sm:hidden">
                  <CircleDot className="mr-2 h-4 w-4" />
                  <span>Segmentler</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="sm:hidden" />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cikis Yap</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold">Diagramlarim</h2>
          <Button onClick={handleNewProject} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Yeni Venn Diagram
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">
            Yukleniyor...
          </div>
        ) : diagrams.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              Henuz kayitli diagram yok.
            </p>
            <Button onClick={handleNewProject} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Ilk diagraminizi olusturun
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {diagrams.map((diagram) => (
              <div key={diagram.id} className="relative group">
                <ProjectCard
                  title={diagram.name}
                  description={diagram.description || `${diagram.segments.length} segment`}
                  createdAt={formatDate(diagram.updatedAt)}
                  onClick={() => handleOpenDiagram(diagram.id)}
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                  onClick={(e) => handleDeleteDiagram(diagram.id, e)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
