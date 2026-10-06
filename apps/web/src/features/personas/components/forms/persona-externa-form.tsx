'use client';

import type { z } from 'zod';

import { TextField } from '@/shared/components/ui/form';
import { EXTERNA_FORM_COPY as X } from '@/features/personas/constants/form-copy';
import { PERSONA_LIMITS } from '@/features/personas/constants/personas';
import { externaDto } from '@/features/personas/helpers/forms';
import { usePersonaForm } from '@/features/personas/hooks/use-persona-form';
import {
  personaExternaFormSchema,
  type PersonaExternaFormValues,
} from '@/features/personas/models/form-schemas';
import {
  createPersonaExterna,
  updatePersona,
} from '@/features/personas/services/personas-api';
import { PersonaFormActions } from '@/features/personas/components/forms/persona-form-actions';
import { NombreField } from '@/features/personas/components/forms/nombre-field';

export interface PersonaExternaFormProps {
  readonly initial: PersonaExternaFormValues;
  readonly editId?: string;
}

/** Alta (`POST /personas/externas`) o edición (`PATCH /personas/:id`). */
function saveExterna(editId: string | undefined) {
  return (parsed: z.output<typeof personaExternaFormSchema>): Promise<unknown> =>
    editId ? updatePersona({ id: editId, dto: externaDto(parsed) }) : createPersonaExterna(externaDto(parsed));
}

/** Form de persona externa: nombre, contacto y notas (ambos opcionales). */
export function PersonaExternaForm({
  initial,
  editId,
}: PersonaExternaFormProps) {
  const form = usePersonaForm({
    schema: personaExternaFormSchema,
    initial,
    save: saveExterna(editId),
    successMessage: editId ? X.UPDATED_OK : X.CREATED_OK,
  });
  return (
    <form
      noValidate
      onSubmit={(event) => void form.submit(event)}
      className="flex flex-col gap-5"
    >
      <NombreField
        value={form.values.nombre}
        error={form.errors.nombre}
        valid={form.valid.nombre}
        onChange={(value) => form.update('nombre', value)}
        onBlur={() => form.blur('nombre')}
      />
      <TextField
        label={X.CONTACTO}
        name="contacto"
        helper={X.CONTACTO_HINT}
        placeholder={X.CONTACTO_PLACEHOLDER}
        maxLength={PERSONA_LIMITS.CONTACTO_MAX}
        value={form.values.contacto}
        error={form.errors.contacto}
        onChange={(value) => form.update('contacto', value)}
        onBlur={() => form.blur('contacto')}
      />
      <TextField
        label={X.NOTAS}
        name="notas"
        helper={X.NOTAS_HINT}
        placeholder={X.NOTAS_PLACEHOLDER}
        value={form.values.notas}
        onChange={(value) => form.update('notas', value)}
      />
      <PersonaFormActions
        editing={editId !== undefined}
        saving={form.saving}
        createLabel={X.CREATE}
      />
    </form>
  );
}
