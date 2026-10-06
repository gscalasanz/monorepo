import { Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/shared/components/ui/button';
import { DETAIL_COPY as C } from '@/features/inscripciones/constants/copy';
import { inscripcionRoutes } from '@/features/inscripciones/constants/routes';

interface DetailActionsProps {
  readonly id: string;
  readonly onDelete: () => void;
}

/** Pie del detalle: "Eliminar" y "Editar inscripción". */
export function DetailActions({ id, onDelete }: DetailActionsProps) {
  return (
    <footer
      role="group"
      aria-label={C.ACTIONS}
      className="flex flex-wrap justify-end gap-2"
    >
      <Button
        variant="danger-soft"
        icon={<Trash2 aria-hidden />}
        onClick={onDelete}
      >
        {C.DELETE}
      </Button>
      <Button
        icon={<Pencil aria-hidden />}
        nativeButton={false}
        render={<Link href={inscripcionRoutes.edit(id)} />}
      >
        {C.EDIT}
      </Button>
    </footer>
  );
}
