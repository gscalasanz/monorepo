import { cn } from '@/shared/lib/utils';

export interface LegendItem {
  readonly label: string;
  readonly color: string;
  /** Valor ya formateado (alineado a la derecha, tabular). */
  readonly value?: string;
}

export interface ChartLegendProps {
  readonly items: readonly LegendItem[];
  readonly className?: string;
}

/** Leyenda: swatch + nombre (ink) + monto alineado. Identidad nunca solo por color. */
export function ChartLegend({ items, className }: ChartLegendProps) {
  return (
    <ul className={cn('grid gap-2', className)}>
      {items.map((item, index) => (
        <li
          key={`${item.label}-${index}`}
          className="grid grid-cols-[10px_minmax(0,1fr)_auto] items-center gap-2 text-[13px] text-ink"
        >
          <span aria-hidden className="size-2 rounded-[2px]" style={{ background: item.color }} />
          <span className="truncate text-ink-muted">{item.label}</span>
          {item.value === undefined ? null : (
            <span className="font-medium tabular-nums">{item.value}</span>
          )}
        </li>
      ))}
    </ul>
  );
}
