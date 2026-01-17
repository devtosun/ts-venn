import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { ForeignKey } from '@/services/storage/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ForeignKeyEditorProps {
  foreignKeys: ForeignKey[];
  onChange: (foreignKeys: ForeignKey[]) => void;
}

export function ForeignKeyEditor({ foreignKeys, onChange }: ForeignKeyEditorProps) {
  const [newTable, setNewTable] = useState('');
  const [newColumn, setNewColumn] = useState('');

  const handleAdd = () => {
    if (!newTable.trim() || !newColumn.trim()) return;

    const newFk: ForeignKey = {
      id: `temp-${Date.now()}`,
      table: newTable.trim(),
      column: newColumn.trim(),
    };

    onChange([...foreignKeys, newFk]);
    setNewTable('');
    setNewColumn('');
  };

  const handleRemove = (id: string) => {
    onChange(foreignKeys.filter((fk) => fk.id !== id));
  };

  return (
    <div className="space-y-4">
      <Label>Foreign Keys</Label>

      {foreignKeys.length > 0 && (
        <div className="space-y-2">
          {foreignKeys.map((fk) => (
            <div
              key={fk.id}
              className="flex items-center gap-2 p-2 bg-secondary rounded-md"
            >
              <span className="flex-1 text-sm">
                <span className="font-medium">{fk.table}</span>
                <span className="text-muted-foreground">.</span>
                <span>{fk.column}</span>
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemove(fk.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <Input
          placeholder="Tablo"
          value={newTable}
          onChange={(e) => setNewTable(e.target.value)}
          className="flex-1"
        />
        <Input
          placeholder="Kolon"
          value={newColumn}
          onChange={(e) => setNewColumn(e.target.value)}
          className="flex-1"
        />
        <Button type="button" variant="outline" size="icon" onClick={handleAdd}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
