'use client';

import { PERSONA_TYPE } from '@/shared/domain';
import { EDUCADOR_FORM_COPY as E } from '@/features/personas/constants/form-copy';
import {
  EMPTY_EDUCADOR,
  educadorValues,
} from '@/features/personas/helpers/forms';
import { usePersonaById } from '@/features/personas/hooks/use-persona-by-id';
import { EducadorForm } from '@/features/personas/components/forms/educador-form';
import { PersonaFormFrame } from '@/features/personas/components/forms/persona-form-frame';

/** `/personas/educadores/crear` y `/personas/educadores/:id/editar`. */
export function EducadorFormView({ id }: { readonly id?: string }) {
  const { persona, isLoading, error, wrongType } = usePersonaById({
    id,
    tipo: PERSONA_TYPE.EDUCADOR,
  });
  const editing = id !== undefined;
  return (
    <PersonaFormFrame
      title={editing ? E.EDIT_TITLE : E.NEW_TITLE}
      subtitle={editing ? E.EDIT_SUBTITLE : E.NEW_SUBTITLE}
      loading={isLoading}
      error={error}
      wrongType={wrongType}
    >
      {editing && !persona ? null : (
        <EducadorForm
          key={persona?.id ?? 'new'}
          editId={id}
          initial={persona ? educadorValues(persona) : EMPTY_EDUCADOR}
        />
      )}
    </PersonaFormFrame>
  );
}
