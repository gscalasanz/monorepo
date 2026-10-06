'use client';

import { PERSONA_TYPE } from '@/shared/domain';
import { EXTERNA_FORM_COPY as X } from '@/features/personas/constants/form-copy';
import {
  EMPTY_EXTERNA,
  externaValues,
} from '@/features/personas/helpers/forms';
import { usePersonaById } from '@/features/personas/hooks/use-persona-by-id';
import { PersonaExternaForm } from '@/features/personas/components/forms/persona-externa-form';
import { PersonaFormFrame } from '@/features/personas/components/forms/persona-form-frame';

/** `/personas/personas-externas/crear` y `/personas/personas-externas/:id/editar`. */
export function PersonaExternaFormView({ id }: { readonly id?: string }) {
  const { persona, isLoading, error, wrongType } = usePersonaById({
    id,
    tipo: PERSONA_TYPE.EXTERNA,
  });
  const editing = id !== undefined;
  return (
    <PersonaFormFrame
      title={editing ? X.EDIT_TITLE : X.NEW_TITLE}
      subtitle={editing ? X.EDIT_SUBTITLE : X.NEW_SUBTITLE}
      loading={isLoading}
      error={error}
      wrongType={wrongType}
    >
      {editing && !persona ? null : (
        <PersonaExternaForm
          key={persona?.id ?? 'new'}
          editId={id}
          initial={persona ? externaValues(persona) : EMPTY_EXTERNA}
        />
      )}
    </PersonaFormFrame>
  );
}
