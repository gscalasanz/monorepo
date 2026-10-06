'use client';

import { ComboboxField, DateField, RadioCardsField } from '@/shared/components/ui/form';
import type { SelectOption } from '@/shared/queries';
import { MOVIMIENTOS_COPY as C } from '@/features/movimientos/constants/copy';
import { MEDIO_PAGO_OPTIONS } from '@/features/movimientos/helpers/form-options';
import type { MovimientoCreateForm } from '@/features/movimientos/hooks/use-movimiento-create-form';

interface CreatePaymentFieldsProps {
  readonly form: MovimientoCreateForm;
  readonly personaOptions: readonly SelectOption[];
}

/** Medio de pago, responsable y fecha. */
export function CreatePaymentFields({
  form,
  personaOptions,
}: CreatePaymentFieldsProps) {
  const { values, errors, valid, update, blur } = form;
  return (
    <>
      <RadioCardsField
        label={C.MEDIO_PAGO}
        required
        columns={2}
        options={MEDIO_PAGO_OPTIONS}
        value={values.medioPago}
        onChange={(value) => value && update('medioPago', value)}
      />
      <ComboboxField
        label={C.RESPONSABLE}
        required
        placeholder={C.RESPONSABLE_PLACEHOLDER}
        emptyText={C.NO_RESULTS}
        options={personaOptions}
        value={values.responsableId}
        onChange={(value) => update('responsableId', value)}
        onBlur={() => blur('responsableId')}
        error={errors.responsableId}
      />
      <DateField
        label={C.FECHA}
        required
        value={values.fecha}
        onChange={(value) => update('fecha', value)}
        onBlur={() => blur('fecha')}
        error={errors.fecha}
        valid={valid.fecha}
      />
    </>
  );
}
