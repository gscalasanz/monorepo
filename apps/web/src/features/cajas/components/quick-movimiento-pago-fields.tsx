'use client';

import { ComboboxField, SelectField } from '@/shared/components/ui/form';
import { ESTADO_PAGO } from '@/shared/domain';
import { CAJAS_COPY as C } from '@/features/cajas/constants/copy';
import {
  ESTADO_OPTIONS,
  MEDIO_OPTIONS,
} from '@/features/cajas/helpers/quick-movimiento';
import type { QuickMovimientoForm } from '@/features/cajas/hooks/use-quick-movimiento-form';

type Props = { readonly form: QuickMovimientoForm };

const PERSONA_FIELD = (options: QuickMovimientoForm['personaOptions']) => ({
  required: true,
  emptyText: C.NO_RESULTS,
  options,
  className: 'sm:col-span-2',
});

/** Responsable, medio, estado y persona a reembolsar (si queda pendiente). */
export function QuickMovimientoPagoFields({ form }: Props) {
  const { values, validation } = form;
  const pendiente = values.estadoPago === ESTADO_PAGO.PENDIENTE_REEMBOLSO;
  const personaProps = PERSONA_FIELD(form.personaOptions);
  return (
    <>
      <ComboboxField
        {...personaProps}
        label={C.RESPONSABLE}
        placeholder={C.RESPONSABLE_PLACEHOLDER}
        value={values.responsableId}
        error={validation.errors.responsableId}
        onChange={form.setResponsable}
        onBlur={() => validation.onBlur('responsableId', values.responsableId)}
      />
      <SelectField
        label={C.MEDIO_PAGO}
        required
        placeholder={C.MEDIO_PLACEHOLDER}
        options={MEDIO_OPTIONS}
        value={values.medioPago}
        onChange={(value) => value && form.update('medioPago', value)}
      />
      <SelectField
        label={C.ESTADO}
        required
        placeholder={C.ESTADO_PLACEHOLDER}
        options={ESTADO_OPTIONS}
        value={values.estadoPago}
        onChange={(value) => value && form.setEstadoPago(value)}
      />
      {pendiente && (
        <ComboboxField
          {...personaProps}
          label={C.PERSONA_REEMBOLSAR}
          placeholder={C.PERSONA_REEMBOLSAR_PLACEHOLDER}
          value={values.personaAReembolsarId}
          error={form.reembolsoError ?? undefined}
          onChange={form.setPersonaAReembolsar}
        />
      )}
    </>
  );
}
