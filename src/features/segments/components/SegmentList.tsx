import { useState, useEffect } from 'react';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import type { SegmentDefinition, Element } from '@/services/storage/types';
import { elementStorage } from '@/services/storage';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DeleteDialog } from '@/features/elements/components/DeleteDialog';

interface SegmentListProps {
  segments: SegmentDefinition[];
  onEdit: (segment: SegmentDefinition) => void;
  onDelete: (id: string) => void;
}

export function SegmentList({ segments, onEdit, onDelete }: SegmentListProps) {
  const [deleteTarget, setDeleteTarget] = useState<SegmentDefinition | null>(null);
  const [elements, setElements] = useState<Element[]>([]);

  useEffect(() => {
    elementStorage.getAll().then(setElements);
  }, []);

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      onDelete(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const getElementCodes = (elementIds: string[]) => {
    return elementIds
      .map((id) => elements.find((e) => e.id === id)?.code)
      .filter(Boolean)
      .join(', ');
  };

  if (segments.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Henuz segment eklenmemis. Yeni bir segment ekleyerek baslayin.
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Kod</TableHead>
            <TableHead>Isim</TableHead>
            <TableHead>Elementler</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {segments.map((segment) => (
            <TableRow key={segment.id}>
              <TableCell className="font-mono font-medium">
                {segment.code}
              </TableCell>
              <TableCell>
                {segment.name || '-'}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {getElementCodes(segment.elementIds) || '-'}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(segment)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Duzenle
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDeleteTarget(segment)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Sil
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <DeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Segment Sil"
        description={`"${deleteTarget?.code}" segmentini silmek istediginize emin misiniz? Bu islem geri alinamaz.`}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
