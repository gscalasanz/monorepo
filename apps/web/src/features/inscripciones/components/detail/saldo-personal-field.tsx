import { Info, Wallet } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { MoneyField } from '@/shared/components/ui/form';
import { PAGO_COPY as C } from '@/features/inscripciones/constants/copy';

interface SaldoPersonalFieldProps {
  readonly value: number | null;
  readonly saldo: number;
  readonly loading: boolean;
  readonly excede: boolean;
  readonly onChange: (value: number | null) => void;
  readonly onUsarTodo: () => void;
}

/** "Usar Saldo Personal" con disponible + "Usar todo" (o "Sin saldo disponible"). */
export function SaldoPersonalField({
  value,
  saldo,
  loading,
  excede,
  onChange,
  onUsarTodo,
}: SaldoPersonalFieldProps) {
  const disponible = saldo > 0;
  const info = loading ? (
    <span role="status">{C.LOADING_SALDO}</span>
  ) : disponible ? (
    <>
      <span className="flex items-center gap-1.5">
        <Wallet aria-hidden className="size-4" />
        {C.disponible(saldo)}
      </span>
      <Button type="button" variant="link" size="sm" onClick={onUsarTodo}>
        {C.USAR_TODO}
      </Button>
    </>
  ) : (
    <span className="flex items-center gap-1.5">
      <Info aria-hidden className="size-4" />
      {C.SIN_SALDO}
    </span>
  );
  return (
    <div className="grid gap-2 rounded-lg bg-recessed p-3">
      <MoneyField
        label={C.USAR_SALDO}
        size="md"
        disabled={!loading && !disponible}
        error={excede ? C.excedeSaldo(saldo) : undefined}
        value={value}
        onChange={onChange}
      />
      <div className="flex flex-wrap items-center justify-between gap-2 text-[13px] text-ink-muted">
        {info}
      </div>
    </div>
  );
}
