import { useState, useEffect } from 'react';
import type { Element, ForeignKey } from '@/services/storage/types';
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
import { ForeignKeyEditor } from './ForeignKeyEditor';

interface ElementFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  element?: Element | null;
  onSubmit: (data: { code: string; description: string; foreignKeys: ForeignKey[] }) => void;
}

export function ElementForm({ open, onOpenChange, element, onSubmit }: ElementFormProps) {
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [foreignKeys, setForeignKeys] = useState<ForeignKey[]>([]);

  useEffect(() => {
    if (element) {
      setCode(element.code);
      setDescription(element.description);
      setForeignKeys(element.foreignKeys);
    } else {
      setCode('');
      setDescription('');
      setForeignKeys([]);
    }
  }, [element, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    onSubmit({
      code: code.trim().toUpperCase(),
      description: description.trim(),
      foreignKeys,
    });

    onOpenChange(false);
  };

  const isEdit = !!element;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Element Düzenle' : 'Yeni Element'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Kod</Label>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="USR, ORD, PRD..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Açıklama</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Element açıklaması..."
              rows={3}
            />
          </div>

          <ForeignKeyEditor
            foreignKeys={foreignKeys}
            onChange={setForeignKeys}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              İptal
            </Button>
            <Button type="submit">
              {isEdit ? 'Güncelle' : 'Oluştur'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
