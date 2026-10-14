'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { RowActionsMenu, type RowAction } from '@/shared/components/data';
import { MOVIMIENTOS_COPY as C } from '@/features/movimientos/constants/copy';
import { MOVIMIENTO_ROUTES } from '@/features/movimientos/constants/movimientos';

interface MovimientoRowActionsProps {
  readonly id: string;
  /** Concepto del movimiento: da el nombre accesible del menú. */
  readonly label: string;
  readonly onDelete: (id: string) => void;
}

/** Menú ⋯ de la fila: Editar → `/movimientos/:id/editar`; Eliminar → diálogo. */
export function MovimientoRowActions({
  id,
  label,
  onDelete,
}: MovimientoRowActionsProps) {
  const router = useRouter();
  const actions: readonly RowAction[] = [
    {
      key: 'edit',
      label: C.EDIT,
      icon: Pencil,
      onSelect: () => router.push(MOVIMIENTO_ROUTES.edit(id)),
    },
    {
      key: 'delete',
      label: C.DELETE,
      icon: Trash2,
      destructive: true,
      onSelect: () => onDelete(id),
    },
  ];
  return (
    <RowActionsMenu actions={actions} ariaLabel={C.rowActions(label)} />
  );
}
