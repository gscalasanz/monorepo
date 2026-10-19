'use client';

import { Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { RowActionsMenu } from '@/shared/components/data';
import { NavChevron } from '@/shared/components/ui/nav-chevron';
import type { Campamento } from '@/shared/domain';
import { LIST_COPY as C } from '@/features/campamentos/constants/copy';
import { CAMPAMENTO_ROUTES } from '@/features/campamentos/constants/routes';

export interface CampamentoRowActionsProps {
  readonly campamento: Campamento;
  readonly onDelete: (campamento: Campamento) => void;
}

/** ⋯ de la fila: Editar / Eliminar (tabla y lista mobile). */
export function CampamentoMenu({
  campamento,
  onDelete,
}: CampamentoRowActionsProps) {
  const router = useRouter();
  return (
    <RowActionsMenu
      ariaLabel={C.acciones(campamento.nombre)}
      actions={[
        {
          key: 'edit',
          label: C.EDITAR,
          icon: Pencil,
          onSelect: () => router.push(CAMPAMENTO_ROUTES.edit(campamento.id)),
        },
        {
          key: 'delete',
          label: C.ELIMINAR,
          icon: Trash2,
          destructive: true,
          onSelect: () => onDelete(campamento),
        },
      ]}
    />
  );
}

/** Columna de acciones: ⋯ + chevron al detalle (sin propagar el click de la fila). */
export function CampamentoRowActions(props: CampamentoRowActionsProps) {
  return (
    <div
      className="flex items-center justify-end gap-1"
      onClick={(event) => event.stopPropagation()}
    >
      <CampamentoMenu {...props} />
      <Link
        href={CAMPAMENTO_ROUTES.detail(props.campamento.id)}
        aria-label={C.abrir(props.campamento.nombre)}
        className="group flex size-8 items-center justify-center rounded-md hover:bg-recessed focus-visible:outline-2 focus-visible:outline-focus"
      >
        <NavChevron />
      </Link>
    </div>
  );
}
