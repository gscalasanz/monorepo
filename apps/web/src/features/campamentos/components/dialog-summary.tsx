import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

export interface SummaryRow {
  readonly label: string;
  readonly value: ReactNode;
  /** Fila resaltada (saldo disponible). */
  readonly highlight?: boolean;
}

/** Encabezado de los diálogos de participante: nombre + resumen label/valor. */
export function DialogSummary({
  nombre,
  caption,
  rows,
  children,
}: {
  readonly nombre: string;
  readonly caption: string;
  readonly rows: readonly SummaryRow[];
  readonly children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg bg-recessed p-3">
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-sm font-semibold text-ink">
          {nombre}
        </span>
        <span className="text-xs text-ink-subtle">{caption}</span>
      </div>
      <dl className="flex flex-col gap-1.5 text-[13px]">
        {rows.map((row) => (
          <div
            key={row.label}
            className={cn(
              'flex items-center justify-between gap-3',
              row.highlight && 'font-medium',
            )}
          >
            <dt className="text-ink-muted">{row.label}</dt>
            <dd className="text-ink tabular-nums">{row.value}</dd>
          </div>
        ))}
      </dl>
      {children}
    </div>
  );
}
