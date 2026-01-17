import { useState } from 'react';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import type { Element } from '@/services/storage/types';
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
import { DeleteDialog } from './DeleteDialog';

interface ElementListProps {
  elements: Element[];
  onEdit: (element: Element) => void;
  onDelete: (id: string) => void;
}

export function ElementList({ elements, onEdit, onDelete }: ElementListProps) {
  const [deleteTarget, setDeleteTarget] = useState<Element | null>(null);

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      onDelete(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  if (elements.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Henüz element eklenmemiş. Yeni bir element ekleyerek başlayın.
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Kod</TableHead>
            <TableHead>Açıklama</TableHead>
            <TableHead className="w-[100px] text-center">FK Sayısı</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {elements.map((element) => (
            <TableRow key={element.id}>
              <TableCell className="font-mono font-medium">
                {element.code}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {element.description || '-'}
              </TableCell>
              <TableCell className="text-center">
                {element.foreignKeys.length}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(element)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Düzenle
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDeleteTarget(element)}
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
        title="Element Sil"
        description={`"${deleteTarget?.code}" elementini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
