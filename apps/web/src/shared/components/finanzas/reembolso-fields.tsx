'use client';

import { Info } from 'lucide-react';

import { ComboboxField, type FieldOption } from '@/shared/components/ui/form';
import { ESTADO_PAGO } from '@/shared/domain';

import { FINANZAS_COPY } from './copy';
import type { GastoFormController } from './use-gasto-form';

const C = FINANZAS_COPY.gasto;

export interface ReembolsoFieldsProps {
  readonly form: GastoFormController;
  readonly personaOptions: readonly FieldOption[];
}

/** Banner + "Persona a Reembolsar": solo con estado "Pendiente de Reembolso". */
export function ReembolsoFields({
  form,
  personaOptions,
}: ReembolsoFieldsProps) {
  if (form.values.estadoPago !== ESTADO_PAGO.PENDIENTE_REEMBOLSO) return null;
  return (
    <>
      <p className="flex items-start gap-2 rounded-md bg-info-soft px-3 py-2.5 text-sm text-info">
        <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
        {C.reembolsoBanner}
      </p>
      <ComboboxField
        label={C.personaAReembolsar}
        required
        placeholder={C.personaAReembolsarPlaceholder}
        options={personaOptions}
        value={form.values.personaAReembolsarId}
        onChange={form.setPersonaAReembolsar}
        error={form.errors.personaAReembolsarId}
      />
    </>
  );
}
