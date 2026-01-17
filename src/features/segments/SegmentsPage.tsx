import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { useSegmentsState } from './state/segmentsState';
import { SegmentList } from './components/SegmentList';
import { SegmentForm } from './components/SegmentForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { SegmentDefinition } from '@/services/storage/types';

export function SegmentsPage() {
  const navigate = useNavigate();
  const { segments, loading, fetchSegments, createSegment, updateSegment, deleteSegment } =
    useSegmentsState();

  const [formOpen, setFormOpen] = useState(false);
  const [editingSegment, setEditingSegment] = useState<SegmentDefinition | null>(null);

  useEffect(() => {
    fetchSegments();
  }, [fetchSegments]);

  const handleCreate = () => {
    setEditingSegment(null);
    setFormOpen(true);
  };

  const handleEdit = (segment: SegmentDefinition) => {
    setEditingSegment(segment);
    setFormOpen(true);
  };

  const handleSubmit = async (data: {
    code: string;
    name: string;
    description: string;
    elementIds: string[];
  }) => {
    if (editingSegment) {
      await updateSegment(editingSegment.id, data);
    } else {
      await createSegment(data);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteSegment(id);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-card">
        <div className="container mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Geri</span>
          </Button>
          <div className="h-6 w-px bg-border" />
          <h1 className="text-lg sm:text-xl font-semibold flex-1">
            Segmentler
          </h1>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Yeni Segment</span>
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <Card>
          <CardHeader>
            <CardTitle>Segment Listesi</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Yukleniyor...
              </div>
            ) : (
              <SegmentList
                segments={segments}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </CardContent>
        </Card>
      </main>

      <SegmentForm
        open={formOpen}
        onOpenChange={setFormOpen}
        segment={editingSegment}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
