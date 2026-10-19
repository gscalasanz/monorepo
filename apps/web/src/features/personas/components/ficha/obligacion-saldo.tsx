import { Money } from '@/shared/components/data';
import { FICHA_COPY as C } from '@/features/personas/constants/copy';

/** Saldo pendiente de una obligación ("pendiente" en rojo o "$ 0 al día"). */
export function ObligacionSaldo({ pendiente }: { readonly pendiente: number }) {
  const hasDebt = pendiente > 0;
  return (
    <span className="flex shrink-0 flex-col items-end gap-0.5 text-right">
      <span className="sr-only">{C.SALDO_PENDIENTE}</span>
      <Money
        amount={hasDebt ? pendiente : 0}
        tone={hasDebt ? 'debt' : undefined}
        className="text-sm"
      />
      <span className="text-xs text-ink-subtle">
        {hasDebt ? C.PENDIENTE : C.AL_DIA}
      </span>
    </span>
  );
}
