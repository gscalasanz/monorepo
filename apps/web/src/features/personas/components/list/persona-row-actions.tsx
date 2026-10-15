'use client';

import { Eye, Pencil, Trash2, UserCheck, UserX } from 'lucide-react';

import Link from 'next/link';

import { RowActionsMenu, type RowAction } from '@/shared/components/data';
import { NavChevron } from '@/shared/components/ui/nav-chevron';
import { isPersonaDisabled } from '@/shared/domain';
import { PERSONAS_COPY as C } from '@/features/personas/constants/copy';
import { PERSONA_ROUTES } from '@/features/personas/constants/personas';
import type { ListedPersona } from '@/features/personas/helpers/list';
import type { PersonaRowActions as Actions } from '@/features/personas/hooks/use-persona-row-actions';

export interface PersonaRowActionsProps {
  readonly persona: ListedPersona;
  readonly actions: Actions;
}

function buildActions({
  persona,
  actions,
}: PersonaRowActionsProps): RowAction[] {
  const estadoAction: RowAction = isPersonaDisabled(persona)
    ? {
        key: 'rehabilitar',
        label: C.ACTION_ENABLE,
        icon: UserCheck,
        onSelect: () => void actions.toggleEstado(persona),
      }
    : {
        key: 'deshabilitar',
        label: C.ACTION_DISABLE,
        description: C.ACTION_DISABLE_HINT,
        icon: UserX,
        onSelect: () => void actions.toggleEstado(persona),
      };
  return [
    {
      key: 'view',
      label: C.ACTION_VIEW,
      icon: Eye,
      onSelect: () => actions.view(persona),
    },
    {
      key: 'edit',
      label: C.ACTION_EDIT,
      icon: Pencil,
      onSelect: () => actions.edit(persona),
    },
    estadoAction,
    {
      key: 'delete',
      label: C.ACTION_DELETE,
      icon: Trash2,
      destructive: true,
      onSelect: () => void actions.remove(persona),
    },
  ];
}

/** ⋯ con las acciones (orden y visibilidad de Angular) + chevron a la ficha; no propagan el clic de la fila. */
export function PersonaRowActions(props: PersonaRowActionsProps) {
  const { persona } = props;
  return (
    <div
      className="flex items-center justify-end gap-1"
      onClick={(event) => event.stopPropagation()}
    >
      <RowActionsMenu
        ariaLabel={C.ROW_ACTIONS(persona.nombre)}
        actions={buildActions(props)}
      />
      <Link
        href={PERSONA_ROUTES.detail({ tipo: persona.tipo, id: persona.id })}
        aria-label={C.ABRIR_FICHA(persona.nombre)}
        className="group flex size-11 items-center justify-center rounded-md hover:bg-recessed focus-visible:outline-2 focus-visible:outline-focus md:size-8"
      >
        <NavChevron />
      </Link>
    </div>
  );
}
