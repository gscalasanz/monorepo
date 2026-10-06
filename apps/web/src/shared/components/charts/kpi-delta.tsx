import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

import { CHARTS_COPY } from './copy';

export interface KpiDeltaValue {
  readonly direction: 'up' | 'down' | 'flat';
  /** Texto del cambio ya formateado ("12 %", "$ 4.000"). */
  readonly value: string;
  /** Comparación en palabras ("vs. agosto"). */
  readonly comparison?: string;
  /**
   * Significado, no signo (DESIGN §KPI): más ingresos = positive, menos deuda =
   * positive, más egresos = neutral. Default `neutral`.
   */
  readonly tone?: 'positive' | 'negative' | 'neutral';
}

const TONE_CLASSES = {
  positive: 'text-money-in',
  negative: 'text-danger',
  neutral: 'text-ink-muted',
} as const;

const ICONS = { up: ArrowUpRight, down: ArrowDownRight, flat: Minus } as const;

/** Delta de KPI: flecha + valor + comparación. La dirección también va en texto (sr-only). */
export function KpiDelta({ delta }: { readonly delta: KpiDeltaValue }) {
  const Icon = ICONS[delta.direction];
  return (
    <p
      className={cn(
        'inline-flex items-center gap-1 text-xs leading-4 font-medium whitespace-nowrap tabular-nums',
        TONE_CLASSES[delta.tone ?? 'neutral'],
      )}
    >
      <Icon aria-hidden className="size-3.5" strokeWidth={2} />
      <span className="sr-only">{CHARTS_COPY.deltaDirection[delta.direction]}</span>
      {delta.value}
      {delta.comparison ? <span className="font-normal text-ink-subtle">{delta.comparison}</span> : null}
    </p>
  );
}
