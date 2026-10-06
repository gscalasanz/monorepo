import { Eye, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/shared/components/ui/button';
import { LIST_COPY as C } from '@/features/inscripciones/constants/copy';
import { inscripcionRoutes } from '@/features/inscripciones/constants/routes';

interface RowActionsProps {
  readonly id: string;
  readonly persona: string;
  readonly onDelete: (id: string) => void;
}

/** Ver / Editar / Eliminar de una fila (íconos con nombre accesible). */
export function RowActions({ id, persona, onDelete }: RowActionsProps) {
  return (
    // La fila es clickeable (abre el detalle): las acciones no deben propagar el click.
    <div
      role="group"
      aria-label={C.COL_ACCIONES}
      className="flex items-center gap-1"
      onClick={(event) => event.stopPropagation()}
    >
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={C.actionLabel(C.VIEW, persona)}
        title={C.VIEW}
        nativeButton={false}
        render={<Link href={inscripcionRoutes.detail(id)} />}
      >
        <Eye aria-hidden />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={C.actionLabel(C.EDIT, persona)}
        title={C.EDIT}
        nativeButton={false}
        render={<Link href={inscripcionRoutes.edit(id)} />}
      >
        <Pencil aria-hidden />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={C.actionLabel(C.DELETE, persona)}
        title={C.DELETE}
        className="hover:text-danger"
        onClick={() => onDelete(id)}
      >
        <Trash2 aria-hidden />
      </Button>
    </div>
  );
}
