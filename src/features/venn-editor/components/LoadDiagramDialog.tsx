import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { diagramStorage } from '@/services/storage';
import type { SavedDiagram } from '@/services/storage/types';

interface LoadDiagramDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoad: (diagram: SavedDiagram) => void;
}

export function LoadDiagramDialog({
  open,
  onOpenChange,
  onLoad,
}: LoadDiagramDialogProps) {
  const [diagrams, setDiagrams] = useState<SavedDiagram[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      loadDiagrams();
    }
  }, [open]);

  const loadDiagrams = async () => {
    setLoading(true);
    try {
      const data = await diagramStorage.getAll();
      setDiagrams(data);
    } finally {
      setLoading(false);
    }
  };

  const handleLoad = (diagram: SavedDiagram) => {
    onLoad(diagram);
    onOpenChange(false);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await diagramStorage.delete(id);
    await loadDiagrams();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Diagram Yükle</DialogTitle>
        </DialogHeader>

        <div className="max-h-[400px] overflow-y-auto">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Yükleniyor...
            </div>
          ) : diagrams.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Kayıtlı diagram bulunamadı.
            </div>
          ) : (
            <div className="space-y-2">
              {diagrams.map((diagram) => (
                <div
                  key={diagram.id}
                  onClick={() => handleLoad(diagram)}
                  className="flex items-center justify-between p-3 rounded-md border hover:bg-accent cursor-pointer transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">{diagram.name}</div>
                    {diagram.description && (
                      <div className="text-sm text-muted-foreground truncate">
                        {diagram.description}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground mt-1">
                      {formatDate(diagram.updatedAt)}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleDelete(diagram.id, e)}
                    className="text-destructive hover:text-destructive flex-shrink-0 ml-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
