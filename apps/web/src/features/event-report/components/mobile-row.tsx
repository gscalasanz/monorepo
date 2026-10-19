import type { ReactNode } from 'react';

export interface MobileRowProps {
  readonly title: ReactNode;
  /** Datos secundarios ("12 unid. · 30%"). */
  readonly subtitle?: ReactNode;
  readonly value: ReactNode;
}

/** Fila de la lista mobile: concepto + metadatos a la izquierda, valor a la derecha. */
export function MobileRow({ title, subtitle, value }: MobileRowProps) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-3">
      <div className="grid min-w-0 gap-0.5">
        <span className="truncate font-medium text-ink">{title}</span>
        {subtitle ? (
          <span className="truncate text-xs text-ink-muted">{subtitle}</span>
        ) : null}
      </div>
      <span className="shrink-0 text-right tabular-nums">{value}</span>
    </div>
  );
}
