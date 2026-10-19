'use client';

import type { SelectOption } from '@/shared/queries';
import { ComboboxField } from '@/shared/components/ui/form';
import { MOVIMIENTOS_COPY as C } from '@/features/movimientos/constants/copy';

interface PersonaReembolsoFieldProps {
  readonly value: string | null;
  readonly onChange: (value: string | null) => void;
  readonly options: readonly SelectOption[];
  readonly error?: string;
}

/** "Persona a Reembolsar": solo se muestra con estado "Pendiente de Reembolso". */
export function PersonaReembolsoField({
  value,
  onChange,
  options,
  error,
}: PersonaReembolsoFieldProps) {
  return (
    <ComboboxField
      label={C.PERSONA_REEMBOLSO}
      required
      value={value}
      onChange={onChange}
      options={options}
      placeholder={C.PERSONA_REEMBOLSO_PLACEHOLDER}
      emptyText={C.NO_RESULTS}
      error={error}
    />
  );
}
