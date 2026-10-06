import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

import { KpiDelta, type KpiDeltaValue } from '@/shared/components/charts/kpi-delta';
import { Sparkline } from '@/shared/components/charts/sparkline';

export interface KpiItem {
  readonly id: string;
  readonly label: string;
  /** Cifra (texto o `<Money size="figure-md" …/>`). */
  readonly value: ReactNode;
  readonly delta?: KpiDeltaValue;
  readonly sparkline?: readonly number[];
  /** Color de la sparkline (variable CSS de token). */
  readonly sparklineColor?: string;
}

export interface KpiStripProps {
  readonly items: readonly KpiItem[];
  /** Nombre accesible del grupo de métricas. */
  readonly ariaLabel?: string;
  readonly className?: string;
}

const COLUMN_CLASSES: Readonly<Record<number, string>> = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
  5: 'md:grid-cols-5',
  6: 'sm:grid-cols-2 md:grid-cols-3',
};

function KpiCell({ item }: { readonly item: KpiItem }) {
  return (
    <div className="grid min-w-0 content-start gap-1.5 bg-surface px-4 py-4 md:px-[18px]">
      <dt className="text-[13px] leading-[18px] text-ink-muted">{item.label}</dt>
      <dd className="flex items-end justify-between gap-3">
        <div className="grid min-w-0 gap-1.5">
          <span className="text-2xl leading-[30px] font-semibold tracking-[-0.025em] whitespace-nowrap text-ink tabular-nums">
            {item.value}
          </span>
          {item.delta ? <KpiDelta delta={item.delta} /> : null}
        </div>
        {item.sparkline ? <Sparkline values={item.sparkline} color={item.sparklineColor} /> : null}
      </dd>
    </div>
  );
}

/**
 * Tira de métricas (DESIGN §KPI): UN panel con celdas separadas por hairlines
 * verticales (horizontales en mobile). No son cards repetidas.
 */
export function KpiStrip({ items, ariaLabel, className }: KpiStripProps) {
  return (
    <dl
      aria-label={ariaLabel}
      className={cn(
        // Hairlines entre celdas con `gap-px` sobre fondo `border`: funciona en 1 o N filas.
        'grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border shadow-xs',
        COLUMN_CLASSES[items.length] ?? 'md:grid-cols-4',
        className,
      )}
    >
      {items.map((item) => (
        <KpiCell key={item.id} item={item} />
      ))}
    </dl>
  );
}
