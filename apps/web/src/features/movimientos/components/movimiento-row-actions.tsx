'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/shared/components/ui/button';
import { MOVIMIENTOS_COPY as C } from '@/features/movimientos/constants/copy';
import { MOVIMIENTO_ROUTES } from '@/features/movimientos/constants/movimientos';

interface MovimientoRowActionsProps {
  readonly id: string;
  readonly onDelete: (id: string) => void;
}

/** Acciones de la fila: Editar → `/movimientos/:id/editar`; Eliminar → diálogo. */
export function MovimientoRowActions({
  id,
  onDelete,
}: MovimientoRowActionsProps) {
  const router = useRouter();
  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="ghost"
        size="icon"
        aria-label={C.EDIT}
        title={C.EDIT}
        onClick={() => router.push(MOVIMIENTO_ROUTES.edit(id))}
      >
        <Pencil className="size-4" aria-hidden />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label={C.DELETE}
        title={C.DELETE}
        className="text-danger hover:text-danger"
        onClick={() => onDelete(id)}
      >
        <Trash2 className="size-4" aria-hidden />
      </Button>
    </div>
  );
}
