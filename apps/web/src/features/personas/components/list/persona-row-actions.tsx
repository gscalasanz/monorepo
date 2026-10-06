'use client';

import { Eye, Pencil, Trash2, UserCheck, UserX } from 'lucide-react';

import { RowActionsMenu, type RowAction } from '@/shared/components/data';
import { isPersonaDisabled } from '@/shared/domain';
import { PERSONAS_COPY as C } from '@/features/personas/constants/copy';
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

/** Menú de acciones de una persona del listado (orden y visibilidad de Angular). */
export function PersonaRowActions(props: PersonaRowActionsProps) {
  return (
    <RowActionsMenu
      ariaLabel={C.ROW_ACTIONS(props.persona.nombre)}
      actions={buildActions(props)}
    />
  );
}
