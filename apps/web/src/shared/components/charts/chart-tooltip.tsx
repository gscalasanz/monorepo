export interface TooltipEntry {
  readonly name?: string | number;
  readonly value?: unknown;
  readonly color?: string;
  readonly fill?: string;
}

export interface ChartTooltipProps {
  readonly active?: boolean;
  readonly label?: string | number;
  readonly entries?: readonly TooltipEntry[];
  readonly format: (value: number) => string;
}

/** Tooltip de gráfico (raised + shadow-md, DESIGN §Panel "Dinero del grupo"). */
export function ChartTooltip({ active, label, entries, format }: ChartTooltipProps) {
  if (!active || !entries || entries.length === 0) return null;
  return (
    <div className="min-w-39 rounded-lg border border-border bg-surface-raised px-2.5 py-2 text-xs leading-4 shadow-md">
      {label === undefined ? null : <p className="mb-1 text-ink-muted">{label}</p>}
      {entries.map((entry) => (
        <p key={String(entry.name)} className="flex items-center justify-between gap-3.5">
          <span className="inline-flex items-center gap-1.5 text-ink-muted">
            <i aria-hidden className="inline-block h-0.5 w-2 rounded-[1px]" style={{ background: entry.color ?? entry.fill }} />
            {entry.name}
          </span>
          <span className="font-medium text-ink tabular-nums">
            {typeof entry.value === 'number' ? format(entry.value) : String(entry.value ?? '')}
          </span>
        </p>
      ))}
    </div>
  );
}
