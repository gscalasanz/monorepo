'use client';

import { SelectField } from '@/shared/components/ui/form';
import {
  CARGO_EDUCADOR_LABELS,
  CARGOS_EDUCADOR,
  RAMA_LABELS,
  RAMAS,
  ramaSchema,
  type CargoEducador,
  type Rama,
} from '@/shared/domain';
import {
  EDUCADOR_FORM_COPY as E,
  FORM_COPY as F,
} from '@/features/personas/constants/form-copy';
import { useEducadorForm } from '@/features/personas/hooks/use-educador-form';
import type { EducadorFormValues } from '@/features/personas/models/form-schemas';
import { EducadorCredentialsFields } from '@/features/personas/components/forms/educador-credentials-fields';
import { PersonaFormActions } from '@/features/personas/components/forms/persona-form-actions';
import { NombreField } from '@/features/personas/components/forms/nombre-field';

/** Opción "Sin rama específica" (el backend recibe `rama` ausente). */
const SIN_RAMA = 'sin-rama';
type RamaOption = Rama | typeof SIN_RAMA;

const RAMA_OPTIONS: readonly {
  readonly value: RamaOption;
  readonly label: string;
}[] = [
  { value: SIN_RAMA, label: E.RAMA_NONE },
  ...RAMAS.map((rama) => ({ value: rama, label: RAMA_LABELS[rama] })),
];
const CARGO_OPTIONS = CARGOS_EDUCADOR.map((cargo) => ({
  value: cargo,
  label: CARGO_EDUCADOR_LABELS[cargo],
}));

function toRama(value: RamaOption | null): Rama | null {
  const parsed = ramaSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

export interface EducadorFormProps {
  readonly initial: EducadorFormValues;
  readonly editId?: string;
}

/** Form de educador: nombre, rama opcional, cargo y (solo al crear) credenciales de acceso. */
export function EducadorForm({ initial, editId }: EducadorFormProps) {
  const form = useEducadorForm({ initial, editId });
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
      <SelectField<RamaOption>
        label={F.RAMA}
        helper={E.RAMA_HINT}
        placeholder={E.RAMA_NONE}
        options={RAMA_OPTIONS}
        value={form.values.rama ?? SIN_RAMA}
        onChange={(value) => form.update('rama', toRama(value))}
      />
      <SelectField<CargoEducador>
        label={E.CARGO}
        required
        placeholder={E.CARGO_PLACEHOLDER}
        options={CARGO_OPTIONS}
        value={form.values.cargo}
        error={form.errors.cargo}
        onChange={(value) => form.update('cargo', value)}
        onBlur={() => form.blur('cargo')}
      />
      {editId ? null : (
        <EducadorCredentialsFields
          values={form.values}
          errors={form.errors}
          onChange={form.updateCredencial}
          onBlur={form.blurCredencial}
        />
      )}
      <PersonaFormActions editing={editId !== undefined} saving={form.saving} createLabel={E.CREATE} />
    </form>
  );
}
