'use client';

import { Globe, GlobeLock, Link2, Lock, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { RowActionsMenu, type RowAction } from '@/shared/components/data';
import type { Evento } from '@/shared/domain';
import { EVENTOS_COPY } from '@/features/eventos/constants/copy';
import { EVENTOS_ROUTES } from '@/features/eventos/constants/eventos';
import type { useEventoActions } from '@/features/eventos/hooks/use-evento-actions';

const C = EVENTOS_COPY.detail;

type Actions = ReturnType<typeof useEventoActions>;

function visibilityAction(evento: Evento, actions: Actions): RowAction {
  return {
    key: 'visibilidad',
    label: evento.reportePublico ? C.hacerPrivado : C.hacerPublico,
    icon: evento.reportePublico ? GlobeLock : Globe,
    onSelect: () => void actions.toggleReportePublico(),
  };
}

/** Acciones secundarias: visibilidad del reporte, link y (si está abierto) editar / cerrar. */
function menuActions(params: {
  readonly evento: Evento;
  readonly actions: Actions;
  readonly onEdit: () => void;
}): readonly RowAction[] {
  const { evento, actions, onEdit } = params;
  const share: readonly RowAction[] = evento.reportePublico
    ? [
        {
          key: 'link',
          label: C.copiarLink,
          icon: Link2,
          onSelect: () => void actions.copiarLink(),
        },
      ]
    : [];
  const edit: readonly RowAction[] = evento.estaCerrado
    ? []
    : [
        { key: 'edit', label: C.editar, icon: Pencil, onSelect: onEdit },
        {
          key: 'close',
          label: C.cerrar,
          icon: Lock,
          destructive: true,
          onSelect: () => void actions.cerrar(),
        },
      ];
  return [visibilityAction(evento, actions), ...share, ...edit];
}

/** Menú ⋯ del encabezado del evento. */
export function EventoHeaderMenu({
  evento,
  actions,
}: {
  readonly evento: Evento;
  readonly actions: Actions;
}) {
  const router = useRouter();
  return (
    <RowActionsMenu
      ariaLabel={C.masAcciones}
      actions={menuActions({
        evento,
        actions,
        onEdit: () => router.push(EVENTOS_ROUTES.edit(evento.id)),
      })}
    />
  );
}
