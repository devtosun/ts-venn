import { useState, useEffect } from 'react';
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

interface SaveDiagramDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultName?: string;
  defaultDescription?: string;
  onSave: (name: string, description: string) => void;
  isUpdate?: boolean;
}

export function SaveDiagramDialog({
  open,
  onOpenChange,
  defaultName = '',
  defaultDescription = '',
  onSave,
  isUpdate = false,
}: SaveDiagramDialogProps) {
  const [name, setName] = useState(defaultName);
  const [description, setDescription] = useState(defaultDescription);

  useEffect(() => {
    if (open) {
      setName(defaultName);
      setDescription(defaultDescription);
    }
  }, [open, defaultName, defaultDescription]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave(name.trim(), description.trim());
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isUpdate ? 'Diagram Güncelle' : 'Diagram Kaydet'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="diagram-name">İsim</Label>
            <Input
              id="diagram-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Diagram ismi..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="diagram-description">Açıklama</Label>
            <Textarea
              id="diagram-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Diagram açıklaması..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              İptal
            </Button>
            <Button type="submit">
              {isUpdate ? 'Güncelle' : 'Kaydet'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
