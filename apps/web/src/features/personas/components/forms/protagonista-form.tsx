'use client';

import { SelectField } from '@/shared/components/ui/form';
import { RAMA_LABELS, RAMAS, type Rama } from '@/shared/domain';
import {
  FORM_COPY as F,
  PROTAGONISTA_FORM_COPY as P,
} from '@/features/personas/constants/form-copy';
import { protagonistaDto } from '@/features/personas/helpers/forms';
import { usePersonaForm } from '@/features/personas/hooks/use-persona-form';
import {
  protagonistaFormSchema,
  type ProtagonistaFormValues,
} from '@/features/personas/models/form-schemas';
import {
  createProtagonista,
  updatePersona,
} from '@/features/personas/services/personas-api';
import { PersonaFormActions } from '@/features/personas/components/forms/persona-form-actions';
import { NombreField } from '@/features/personas/components/forms/nombre-field';
import { ProtagonistaDocsFieldset } from '@/features/personas/components/forms/protagonista-docs-fieldset';

const RAMA_OPTIONS = RAMAS.map((rama) => ({
  value: rama,
  label: RAMA_LABELS[rama],
}));

export interface ProtagonistaFormProps {
  readonly initial: ProtagonistaFormValues;
  /** Con id = edición (`PATCH /personas/:id`); sin id = alta. */
  readonly editId?: string;
}

/** Form de protagonista: nombre, rama y documentación entregada. */
export function ProtagonistaForm({ initial, editId }: ProtagonistaFormProps) {
  const form = usePersonaForm({
    schema: protagonistaFormSchema,
    initial,
    save: (parsed) =>
      editId
        ? updatePersona({ id: editId, dto: protagonistaDto(parsed) })
        : createProtagonista(protagonistaDto(parsed)),
    successMessage: editId ? P.UPDATED_OK : P.CREATED_OK,
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
      <SelectField<Rama>
        label={F.RAMA}
        required
        placeholder={F.RAMA_PLACEHOLDER}
        options={RAMA_OPTIONS}
        value={form.values.rama}
        error={form.errors.rama}
        onChange={(value) => form.update('rama', value)}
        onBlur={() => form.blur('rama')}
      />
      <ProtagonistaDocsFieldset
        values={form.values}
        onChange={(name, value) => form.update(name, value)}
      />
      <PersonaFormActions editing={editId !== undefined} saving={form.saving} createLabel={P.CREATE} />
    </form>
  );
}
