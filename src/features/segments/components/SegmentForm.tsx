import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import type { SegmentDefinition, Element } from '@/services/storage/types';
import { elementStorage } from '@/services/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface SegmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  segment?: SegmentDefinition | null;
  onSubmit: (data: { code: string; name: string; description: string; elementIds: string[] }) => void;
}

export function SegmentForm({ open, onOpenChange, segment, onSubmit }: SegmentFormProps) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedElementIds, setSelectedElementIds] = useState<Set<string>>(new Set());
  const [elements, setElements] = useState<Element[]>([]);

  useEffect(() => {
    elementStorage.getAll().then(setElements);
  }, []);

  useEffect(() => {
    if (segment) {
      setCode(segment.code);
      setName(segment.name);
      setDescription(segment.description);
      setSelectedElementIds(new Set(segment.elementIds));
    } else {
      setCode('');
      setName('');
      setDescription('');
      setSelectedElementIds(new Set());
    }
  }, [segment, open]);

  const toggleElement = (id: string) => {
    setSelectedElementIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    onSubmit({
      code: code.trim().toUpperCase(),
      name: name.trim(),
      description: description.trim(),
      elementIds: Array.from(selectedElementIds),
    });

    onOpenChange(false);
  };

  const isEdit = !!segment;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Segment Duzenle' : 'Yeni Segment'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Kod</Label>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="SEG1, SEG2..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Isim</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Segment ismi..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Aciklama</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Segment aciklamasi..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Elementler</Label>
            <div className="border rounded-md p-2 max-h-48 overflow-y-auto space-y-1">
              {elements.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  Henuz element yok
                </div>
              ) : (
                elements.map((element) => {
                  const isSelected = selectedElementIds.has(element.id);
                  return (
                    <div
                      key={element.id}
                      onClick={() => toggleElement(element.id)}
                      className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-primary/20 border border-primary'
                          : 'hover:bg-accent border border-transparent'
                      }`}
                    >
                      <div
                        className={`h-4 w-4 rounded border flex items-center justify-center flex-shrink-0 ${
                          isSelected ? 'bg-primary border-primary' : 'border-muted-foreground'
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="font-mono font-medium text-sm">{element.code}</span>
                        {element.description && (
                          <span className="text-muted-foreground text-sm ml-2">
                            - {element.description}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            {selectedElementIds.size > 0 && (
              <p className="text-xs text-muted-foreground">
                {selectedElementIds.size} element secildi
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Iptal
            </Button>
            <Button type="submit">
              {isEdit ? 'Guncelle' : 'Olustur'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
