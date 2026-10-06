import { Pencil, Trash2 } from 'lucide-react';

import { KeyValueList, StatusBadge } from '@/shared/components/data';
import { Button } from '@/shared/components/ui/button';
import { ESTADO_PERSONA_LABELS, type PersonaExterna } from '@/shared/domain';
import { EXTERNA_DETAIL_COPY as C } from '@/features/personas/constants/copy';

export interface PersonaExternaCardProps {
  readonly persona: PersonaExterna;
  readonly onEdit: () => void;
  readonly onDelete: () => void;
}

/** Tarjeta de la persona externa: nombre + estado, contacto/notas ('-' si vacío) y acciones. */
export function PersonaExternaCard({
  persona,
  onEdit,
  onDelete,
}: PersonaExternaCardProps) {
  return (
    <section className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-4 shadow-xs md:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-[22px] leading-7 font-semibold tracking-[-0.02em] break-words text-ink">
          {persona.nombre}
        </h2>
        <StatusBadge status={ESTADO_PERSONA_LABELS[persona.estado]} />
      </div>
      <KeyValueList
        columns={1}
        items={[
          { label: C.CONTACTO, value: persona.contacto || C.EMPTY_VALUE },
          { label: C.NOTAS, value: persona.notas || C.EMPTY_VALUE },
        ]}
      />
      <div className="flex flex-wrap justify-end gap-2 border-t border-border pt-4 [&>*]:flex-1 md:[&>*]:flex-none">
        <Button
          variant="danger-soft"
          icon={<Trash2 aria-hidden className="size-4" />}
          onClick={onDelete}
        >
          {C.DELETE}
        </Button>
        <Button
          variant="secondary"
          icon={<Pencil aria-hidden className="size-4" />}
          onClick={onEdit}
        >
          {C.EDIT}
        </Button>
      </div>
    </section>
  );
}
