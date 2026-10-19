'use client';

import { ComboboxField, MoneyField } from '@/shared/components/ui/form';
import { CAJAS_COPY as C } from '@/features/cajas/constants/copy';
import type { useTransferenciaForm } from '@/features/cajas/hooks/use-transferencia-form';

export interface TransferenciaDestinoFieldsProps {
  readonly form: ReturnType<typeof useTransferenciaForm>;
}

/** Destino (cajas no personales, buscable) y monto de la transferencia. */
export function TransferenciaDestinoFields({
  form,
}: TransferenciaDestinoFieldsProps) {
  const { values, validation } = form;
  return (
    <>
      <ComboboxField
        label={C.DESTINO}
        required
        placeholder={C.DESTINO_PLACEHOLDER}
        emptyText={C.NO_RESULTS}
        options={form.destinos}
        value={values.cajaDestinoId}
        error={validation.errors.cajaDestinoId}
        onChange={(value) => form.update('cajaDestinoId', value)}
        onBlur={() => validation.onBlur('cajaDestinoId', values.cajaDestinoId)}
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
      />
    </>
  );
}
