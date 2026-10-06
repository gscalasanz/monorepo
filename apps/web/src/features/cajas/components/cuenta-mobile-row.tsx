import { Money } from '@/shared/components/data';
import { CAJAS_COPY as C } from '@/features/cajas/constants/copy';
import { CuentaActions } from '@/features/cajas/components/cuenta-actions';
import type { CuentaRow } from '@/features/cajas/helpers/cuentas';

const MONEY_DECIMALS = 2;

/** Fila mobile: nombre + rama + saldo, y acciones debajo. */
export function CuentaMobileRow({ row }: { readonly row: CuentaRow }) {
  return (
    <div className="grid w-full gap-1">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-ink">{row.nombre}</p>
          <p className="text-xs text-ink-subtle">{row.rama ?? C.EMPTY_CELL}</p>
        </div>
        <Money
          amount={row.saldo}
          decimals={MONEY_DECIMALS}
          tone={row.saldo < 0 ? 'debt' : undefined}
          className="shrink-0 text-sm"
        />
      </div>
      <CuentaActions row={row} />
    </div>
  );
}
