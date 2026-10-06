import { Wallet } from 'lucide-react';

import { Money } from '@/shared/components/data';
import { Button } from '@/shared/components/ui/button';
import { MoneyField } from '@/shared/components/ui/form';
import { FORM_COPY as C } from '@/features/inscripciones/constants/copy';

interface CuentaPersonalPanelProps {
  readonly saldo: number;
  readonly loading: boolean;
  readonly value: number | null;
  /** Persona nueva: sin uso de caja personal. */
  readonly locked: boolean;
  readonly onChange: (value: number | null) => void;
  readonly onUsarTodo: () => void;
}

/** "Cuenta Personal": saldo disponible de la persona y monto a usar. */
export function CuentaPersonalPanel({
  saldo,
  loading,
  value,
  locked,
  onChange,
  onUsarTodo,
}: CuentaPersonalPanelProps) {
  const hasFunds = saldo > 0;
  const body = loading ? (
    <p role="status" className="text-sm text-ink-muted">
      {C.CONSULTANDO_SALDO}
    </p>
  ) : (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <span className="text-[13px] text-ink-muted">{C.SALDO_DISPONIBLE}</span>
      <Money
        amount={saldo}
        className={hasFunds ? 'font-semibold text-money-in' : 'font-semibold'}
      />
      {hasFunds && !locked ? (
        <Button variant="link" size="sm" onClick={onUsarTodo}>
          {C.USAR_TODO}
        </Button>
      ) : null}
    </div>
  );
  return (
    <div className="grid gap-3 rounded-lg bg-recessed p-3 md:p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-ink">
        <Wallet aria-hidden className="size-4 text-ink-muted" />
        {C.CUENTA_PERSONAL}
      </div>
      {body}
      {!loading && hasFunds ? (
        <MoneyField
          label={C.USAR_CUENTA}
          size="md"
          disabled={locked}
          value={value}
          onChange={onChange}
        />
      ) : null}
    </div>
  );
}
