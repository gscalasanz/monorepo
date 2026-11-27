'use client';

import { Button } from '@/shared/components/ui/button';
import { ComboboxField, MoneyField } from '@/shared/components/ui/form';
import { TRANSFERENCIA_COPY as C } from '@/shared/components/transferencia/copy';
import type { useTransferenciaForm } from '@/shared/components/transferencia/use-transferencia-form';

export interface TransferenciaDestinoFieldsProps {
  readonly form: ReturnType<typeof useTransferenciaForm>;
}

/** Destino (buscable), monto y atajo "Todo el saldo" de la transferencia. */
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
      <div className="-mt-2 flex justify-end">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={!form.canFillMax}
          onClick={form.fillMax}
        >
          {C.MONTO_TODO}
        </Button>
      </div>
    </>
  );
}
