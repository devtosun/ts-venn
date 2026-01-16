import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ProjectCardProps {
  title: string;
  description: string;
  createdAt: string;
  onClick: () => void;
}

export function ProjectCard({ title, description, createdAt, onClick }: ProjectCardProps) {
  return (
    <Card
      className="cursor-pointer transition-all hover:scale-[1.02] hover:border-primary"
      onClick={onClick}
    >
      <div className="h-32 bg-secondary/50 flex items-center justify-center rounded-t-xl">
        <svg viewBox="0 0 100 80" className="w-24 h-20">
          <circle cx="35" cy="40" r="25" fill="hsla(217, 91%, 60%, 0.3)" stroke="hsl(217, 91%, 60%)" strokeWidth="1" />
          <circle cx="65" cy="40" r="25" fill="hsla(346, 77%, 50%, 0.3)" stroke="hsl(346, 77%, 50%)" strokeWidth="1" />
        </svg>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <span className="text-xs text-muted-foreground">{createdAt}</span>
      </CardContent>
    </Card>
  );
}
