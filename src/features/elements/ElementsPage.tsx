import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { useElementsState } from './state/elementsState';
import { ElementList } from './components/ElementList';
import { ElementForm } from './components/ElementForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Element, ForeignKey } from '@/services/storage/types';

export function ElementsPage() {
  const navigate = useNavigate();
  const { elements, loading, fetchElements, createElement, updateElement, deleteElement } =
    useElementsState();

  const [formOpen, setFormOpen] = useState(false);
  const [editingElement, setEditingElement] = useState<Element | null>(null);

  useEffect(() => {
    fetchElements();
  }, [fetchElements]);

  const handleCreate = () => {
    setEditingElement(null);
    setFormOpen(true);
  };

  const handleEdit = (element: Element) => {
    setEditingElement(element);
    setFormOpen(true);
  };

  const handleSubmit = async (data: {
    code: string;
    description: string;
    foreignKeys: ForeignKey[];
  }) => {
    if (editingElement) {
      await updateElement(editingElement.id, data);
    } else {
      await createElement(data);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteElement(id);
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
            Segmentasyon Elementleri
          </h1>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Yeni Element</span>
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <Card>
          <CardHeader>
            <CardTitle>Elementler</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Yükleniyor...
              </div>
            ) : (
              <ElementList
                elements={elements}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </CardContent>
        </Card>
      </main>

      <ElementForm
        open={formOpen}
        onOpenChange={setFormOpen}
        element={editingElement}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
