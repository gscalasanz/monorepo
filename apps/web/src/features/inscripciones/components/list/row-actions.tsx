'use client';

import { Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { RowActionsMenu, type RowAction } from '@/shared/components/data';
import { NavChevron } from '@/shared/components/ui/nav-chevron';
import { LIST_COPY as C } from '@/features/inscripciones/constants/copy';
import { inscripcionRoutes } from '@/features/inscripciones/constants/routes';

interface RowActionsProps {
  readonly id: string;
  readonly persona: string;
  readonly onDelete: (id: string) => void;
}

/** ⋯ con Editar / Eliminar y chevron-link al detalle (la fila entera también navega). */
export function RowActions({ id, persona, onDelete }: RowActionsProps) {
  const router = useRouter();
  const actions: readonly RowAction[] = [
    {
      key: 'edit',
      label: C.EDIT,
      icon: Pencil,
      onSelect: () => router.push(inscripcionRoutes.edit(id)),
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
    // La fila es clickeable: las acciones no deben propagar el click.
    <div
      className="flex items-center justify-end gap-1"
      onClick={(event) => event.stopPropagation()}
    >
      <RowActionsMenu actions={actions} ariaLabel={C.rowActions(persona)} />
      <Link
        href={inscripcionRoutes.detail(id)}
        aria-label={C.abrir(persona)}
        className="group flex size-8 items-center justify-center rounded-md hover:bg-recessed focus-visible:outline-2 focus-visible:outline-focus"
      >
        <NavChevron />
      </Link>
    </div>
  );
}
