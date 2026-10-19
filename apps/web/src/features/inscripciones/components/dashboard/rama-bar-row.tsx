import { DASHBOARD_COPY as C } from '@/features/inscripciones/constants/copy';
import {
  formatPercent,
  type RamaShare,
} from '@/features/inscripciones/helpers/consolidado';

/** Fila "Rama ▬▬▬ n" de la distribución por rama (tooltip "Rama: n (x%)"). */
export function RamaBarRow({ share }: { readonly share: RamaShare }) {
  const pct = formatPercent(share.percentage);
  return (
    <li
      className="grid grid-cols-[96px_minmax(0,1fr)_auto] items-center gap-3 text-[13px]"
      title={C.ramaShare({ rama: share.label, count: share.count, pct })}
    >
      <span className="flex items-center gap-2 text-ink-muted">
        <span
          aria-hidden
          className="size-2 shrink-0 rounded-[2px]"
          style={{ background: share.color }}
        />
        {share.label}
      </span>
      <span
        aria-hidden
        className="h-2 overflow-hidden rounded-pill bg-recessed"
      >
        <span
          className="block h-full rounded-pill"
          style={{ width: `${share.percentage}%`, background: share.color }}
        />
      </span>
      <span className="text-right font-medium text-ink tabular-nums">
        {share.count}
        <span className="sr-only"> ({pct}%)</span>
      </span>
    </li>
  );
}
