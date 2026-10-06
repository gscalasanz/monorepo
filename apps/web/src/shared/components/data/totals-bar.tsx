import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

import { DATA_COPY } from './copy';
import { Money } from './money';

export interface TotalsBarProps {
  readonly count: number;
  readonly ingresos: number;
  readonly egresos: number;
  /** Default `ingresos − egresos`. */
  readonly neto?: number;
  /** Label de la cantidad (default "Movimientos"). */
  readonly countLabel?: string;
  readonly className?: string;
}

function Total({ label, children }: { readonly label: string; readonly children: ReactNode }) {
  return (
    <div className="flex items-baseline gap-2">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="font-medium text-ink tabular-nums">{children}</dd>
    </div>
  );
}

/**
 * Barra de totales hundida que responde al filtro (DESIGN §Chips de filtro).
 * `aria-live="polite"`: el lector anuncia los nuevos totales al filtrar.
 */
export function TotalsBar({
  count,
  ingresos,
  egresos,
  neto = ingresos - egresos,
  countLabel = DATA_COPY.totals.count,
  className,
}: TotalsBarProps) {
  return (
    <dl
      aria-live="polite"
      aria-atomic="true"
      className={cn(
        'flex flex-wrap gap-x-7 gap-y-1.5 border-b border-border bg-recessed px-4 py-3 text-[13px] md:px-[18px]',
        className,
      )}
    >
      <Total label={countLabel}>{count}</Total>
      <Total label={DATA_COPY.totals.ingresos}>
        <Money amount={Math.abs(ingresos)} sign="in" />
      </Total>
      <Total label={DATA_COPY.totals.egresos}>
        <Money amount={Math.abs(egresos)} sign="out" />
      </Total>
      <Total label={DATA_COPY.totals.neto}>
        <Money amount={neto} sign="auto" />
      </Total>
    </dl>
  );
}
