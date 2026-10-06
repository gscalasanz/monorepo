import { DirectionTile, Money } from '@/shared/components/data';
import { EmptyState } from '@/shared/components/feedback';
import { Panel } from '@/shared/components/ui/panel';
import { APP_ROUTES } from '@/shared/constants';
import { DASHBOARD_COPY as C } from '@/features/dashboard/constants/copy';
import type { RecentMovimientoRow } from '@/features/dashboard/helpers/view-model';

/** Últimos 5 movimientos con dirección, detalle y monto con signo. */
export function RecentMovimientosPanel({ rows }: { rows: readonly RecentMovimientoRow[] }) {
  return (
    <Panel title={C.RECENT} action={{ label: C.SEE_MORE, href: APP_ROUTES.MOVIMIENTOS }} flush>
      {rows.length === 0 ? (
        <EmptyState title={C.NO_RECENT} />
      ) : (
        <ul className="divide-y divide-border">
          {rows.map((row) => (
            <li key={row.id} className="flex min-h-14 items-center gap-3 px-4 py-2.5 md:px-[18px]">
              <DirectionTile direction={row.direction} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{row.title}</p>
                <p className="truncate text-xs text-ink-subtle">{row.detail}</p>
              </div>
              <Money amount={row.amount} sign="auto" className="shrink-0 text-sm font-medium" />
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
