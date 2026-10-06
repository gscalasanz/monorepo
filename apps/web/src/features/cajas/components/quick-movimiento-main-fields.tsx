'use client';

import { MoneyField, SelectField } from '@/shared/components/ui/form';
import { CAJAS_COPY as C } from '@/features/cajas/constants/copy';
import {
  TIPO_OPTIONS,
  conceptoOptions,
} from '@/features/cajas/helpers/quick-movimiento';
import type { QuickMovimientoForm } from '@/features/cajas/hooks/use-quick-movimiento-form';

/** Tipo (cambia → resetea concepto), concepto manual del tipo y monto. */
export function QuickMovimientoMainFields({
  form,
}: {
  readonly form: QuickMovimientoForm;
}) {
  const { values, validation } = form;
  return (
    <>
      <SelectField
        label={C.TIPO}
        required
        placeholder={C.TIPO_PLACEHOLDER}
        options={TIPO_OPTIONS}
        value={values.tipo}
        onChange={(value) => value && form.setTipo(value)}
      />
      <SelectField
        label={C.CONCEPTO}
        required
        placeholder={C.CONCEPTO_PLACEHOLDER}
        options={conceptoOptions(values.tipo)}
        value={values.concepto}
        error={validation.errors.concepto}
        onChange={(value) => form.update('concepto', value)}
        onBlur={() => validation.onBlur('concepto', values.concepto)}
      />
      <MoneyField
        label={C.MONTO}
        required
        size="md"
        placeholder={C.MONTO_PLACEHOLDER}
        value={values.monto}
        error={validation.errors.monto}
        onChange={(value) => form.update('monto', value)}
        onBlur={() => validation.onBlur('monto', values.monto)}
        className="sm:col-span-2"
      />
    </>
  );
}
