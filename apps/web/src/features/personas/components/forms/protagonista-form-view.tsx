'use client';

import { PERSONA_TYPE } from '@/shared/domain';
import { PROTAGONISTA_FORM_COPY as P } from '@/features/personas/constants/form-copy';
import {
  EMPTY_PROTAGONISTA,
  protagonistaValues,
} from '@/features/personas/helpers/forms';
import { usePersonaById } from '@/features/personas/hooks/use-persona-by-id';
import { PersonaFormFrame } from '@/features/personas/components/forms/persona-form-frame';
import { ProtagonistaForm } from '@/features/personas/components/forms/protagonista-form';

/** `/personas/protagonistas/crear` y `/personas/protagonistas/:id/editar`. */
export function ProtagonistaFormView({ id }: { readonly id?: string }) {
  const { persona, isLoading, error, wrongType } = usePersonaById({
    id,
    tipo: PERSONA_TYPE.PROTAGONISTA,
  });
  const editing = id !== undefined;
  return (
    <PersonaFormFrame
      title={editing ? P.EDIT_TITLE : P.NEW_TITLE}
      subtitle={editing ? P.EDIT_SUBTITLE : P.NEW_SUBTITLE}
      loading={isLoading}
      error={error}
      wrongType={wrongType}
    >
      {editing && !persona ? null : (
        <ProtagonistaForm
          key={persona?.id ?? 'new'}
          editId={id}
          initial={persona ? protagonistaValues(persona) : EMPTY_PROTAGONISTA}
        />
      )}
    </PersonaFormFrame>
  );
}
