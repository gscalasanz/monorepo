import { HandHeart } from 'lucide-react';

import { KeyValueList, Money } from '@/shared/components/data';
import { Button } from '@/shared/components/ui/button';
import { MoneyField } from '@/shared/components/ui/form';
import { BONIFICAR_COPY as C } from '@/features/inscripciones/constants/copy';
import type { BonificarDialogModel } from '@/features/inscripciones/hooks/use-bonificar-dialog';

/** Monto total, saldo del fondo, "Monto a Bonificar" y atajo "Bonificar el 100%". */
export function BonificarFields({
  state,
  montoTotal,
}: {
  readonly state: BonificarDialogModel;
  readonly montoTotal: number;
}) {
  const saldoTone = state.summary.saldoInsuficiente ? 'debt' : undefined;
  return (
    <>
      <KeyValueList
        items={[
          { label: C.MONTO_TOTAL, value: <Money amount={montoTotal} /> },
          {
            label: C.SALDO_FONDO,
            value: <Money amount={state.saldoFondo} tone={saldoTone} />,
          },
        ]}
      />
      <MoneyField
        label={C.MONTO}
        required
        helper={C.maximo(montoTotal)}
        error={state.fieldError}
        value={state.monto}
        onChange={state.setMonto}
      />
      <Button
        type="button"
        variant="secondary"
        icon={<HandHeart aria-hidden />}
        onClick={() => state.setMonto(montoTotal)}
      >
        {C.bonificarTodo(montoTotal)}
      </Button>
    </>
  );
}
