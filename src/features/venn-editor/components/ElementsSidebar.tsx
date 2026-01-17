import { useEffect } from 'react';
import { GripVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import { useElementsState } from '@/features/elements/state/elementsState';
import { Button } from '@/components/ui/button';
import type { Element } from '@/services/storage/types';

interface ElementsSidebarProps {
  onDragStart: (element: Element, e: React.DragEvent) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function ElementsSidebar({ onDragStart, isOpen, onToggle }: ElementsSidebarProps) {
  const { elements, loading, fetchElements } = useElementsState();

  useEffect(() => {
    fetchElements();
  }, [fetchElements]);

  const handleDragStart = (element: Element, e: React.DragEvent) => {
    e.dataTransfer.setData('application/json', JSON.stringify(element));
    e.dataTransfer.effectAllowed = 'copy';
    onDragStart(element, e);
  };

  return (
    <>
      {/* Toggle button - always visible */}
      <Button
        variant="outline"
        size="icon"
        onClick={onToggle}
        className={`absolute top-2 z-20 h-8 w-8 transition-all ${
          isOpen ? 'left-[11.5rem]' : 'left-2'
        }`}
      >
        {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </Button>

      {/* Sidebar */}
      <div
        className={`absolute left-0 top-0 bottom-0 z-10 w-44 border-r bg-card flex flex-col transition-transform duration-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-3 border-b">
          <h3 className="font-semibold text-sm">Elementler</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {loading ? (
            <div className="text-center py-4 text-muted-foreground text-sm">
              Yükleniyor...
            </div>
          ) : elements.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground text-sm px-2">
              Element yok
            </div>
          ) : (
            elements.map((element) => (
              <div
                key={element.id}
                draggable
                onDragStart={(e) => handleDragStart(element, e)}
                className="flex items-center gap-2 p-2 rounded-md border bg-background hover:bg-accent cursor-grab active:cursor-grabbing transition-colors"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="font-mono font-medium text-sm truncate">
                    {element.code}
                  </div>
                  {element.description && (
                    <div className="text-xs text-muted-foreground truncate">
                      {element.description}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
