import { HandHeart } from 'lucide-react';

import { KeyValueList, Money } from '@/shared/components/data';
import { Button } from '@/shared/components/ui/button';
import { MoneyField } from '@/shared/components/ui/form';
import { BONIFICAR_COPY as C } from '@/features/inscripciones/constants/copy';
import type { BonificarDialogModel } from '@/features/inscripciones/hooks/use-bonificar-dialog';

interface BonificarFieldsProps {
  readonly state: BonificarDialogModel;
  readonly montoTotal: number;
  readonly montoPagado: number;
}

/** Monto total, pagado, saldo del fondo, "Monto a Bonificar" y atajo "Bonificar lo pendiente". */
export function BonificarFields({
  state,
  montoTotal,
  montoPagado,
}: BonificarFieldsProps) {
  const saldoTone = state.summary.saldoInsuficiente ? 'debt' : undefined;
  return (
    <>
      <KeyValueList
        items={[
          { label: C.MONTO_TOTAL, value: <Money amount={montoTotal} /> },
          { label: C.PAGADO, value: <Money amount={montoPagado} /> },
          {
            label: C.SALDO_FONDO,
            value: <Money amount={state.saldoFondo} tone={saldoTone} />,
          },
        ]}
      />
      <MoneyField
        label={C.MONTO}
        required
        helper={C.maximo(state.maximo)}
        error={state.fieldError}
        value={state.monto}
        onChange={state.setMonto}
      />
      <Button
        type="button"
        variant="secondary"
        icon={<HandHeart aria-hidden />}
        onClick={() => state.setMonto(state.maximo)}
      >
        {C.bonificarPendiente(state.maximo)}
      </Button>
    </>
  );
}
