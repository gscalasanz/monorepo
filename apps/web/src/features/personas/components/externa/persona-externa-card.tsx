'use client';

import { Pencil, Trash2 } from 'lucide-react';

import { KeyValueList, RowActionsMenu } from '@/shared/components/data';
import { Button } from '@/shared/components/ui/button';
import { Panel } from '@/shared/components/ui/panel';
import type { PersonaExterna } from '@/shared/domain';
import { EXTERNA_DETAIL_COPY as C } from '@/features/personas/constants/copy';
import { PersonaHeaderCard } from '@/features/personas/components/ficha/persona-header-card';

export interface PersonaExternaCardProps {
  readonly persona: PersonaExterna;
  readonly onEdit: () => void;
  readonly onDelete: () => void;
}

/** Ficha de la persona externa: encabezado como el resto de las fichas + contacto/notas ('-' si vacío). */
export function PersonaExternaCard({
  persona,
  onEdit,
  onDelete,
}: PersonaExternaCardProps) {
  return (
    <>
      <PersonaHeaderCard
        persona={{ ...persona, rama: null, cargo: null }}
        actions={
          <>
            <Button
              variant="secondary"
              icon={<Pencil aria-hidden className="size-4" />}
              onClick={onEdit}
            >
              {C.EDIT}
            </Button>
            <RowActionsMenu
              ariaLabel={C.masAcciones(persona.nombre)}
              actions={[
                {
                  key: 'delete',
                  label: C.DELETE,
                  icon: Trash2,
                  destructive: true,
                  onSelect: onDelete,
                },
              ]}
            />
          </>
        }
      />
      <Panel title={C.DATOS}>
        <KeyValueList
          columns={2}
          items={[
            { label: C.CONTACTO, value: persona.contacto || C.EMPTY_VALUE },
            { label: C.NOTAS, value: persona.notas || C.EMPTY_VALUE },
          ]}
        />
      </Panel>
    </>
  );
}
