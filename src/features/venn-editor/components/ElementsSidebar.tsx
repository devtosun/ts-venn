import { useEffect } from 'react';
import { ChevronLeft, ChevronRight, GripVertical } from 'lucide-react';
import { useSegmentsState } from '@/features/segments/state/segmentsState';
import { Button } from '@/components/ui/button';
import type { SegmentDefinition } from '@/services/storage/types';

export const SEGMENT_DRAG_TYPE = 'application/x-segment-definition';

interface SegmentsSidebarProps {
  onAddSegment: (segment: SegmentDefinition) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function SegmentsSidebar({ onAddSegment, isOpen, onToggle }: SegmentsSidebarProps) {
  const { segments, loading, fetchSegments } = useSegmentsState();

  useEffect(() => {
    fetchSegments();
  }, [fetchSegments]);

  return (
    <>
      {/* Toggle button - always visible */}
      <Button
        variant="outline"
        size="icon"
        onClick={onToggle}
        className={`absolute top-2 z-20 h-8 w-8 transition-all ${
          isOpen ? 'left-[12.5rem]' : 'left-2'
        }`}
      >
        {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </Button>

      {/* Sidebar */}
      <div
        className={`absolute left-0 top-0 bottom-0 z-10 w-48 border-r bg-card flex flex-col transition-transform duration-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-3 border-b">
          <h3 className="font-semibold text-sm">Segmentler</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Diagrama eklemek icin tiklayin
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {loading ? (
            <div className="text-center py-4 text-muted-foreground text-sm">
              Yukleniyor...
            </div>
          ) : segments.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground text-sm px-2">
              Segment yok. Once /segments sayfasindan segment olusturun.
            </div>
          ) : (
            segments.map((segment) => (
              <div
                key={segment.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData(SEGMENT_DRAG_TYPE, JSON.stringify(segment));
                  e.dataTransfer.effectAllowed = 'copy';
                }}
                onClick={() => onAddSegment(segment)}
                className="flex items-center gap-2 p-2 rounded-md border bg-background hover:bg-accent cursor-grab active:cursor-grabbing transition-colors"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="font-mono font-medium text-sm truncate">
                    {segment.code}
                  </div>
                  {segment.name && (
                    <div className="text-xs text-muted-foreground truncate">
                      {segment.name}
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
