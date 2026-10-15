'use client';

import { useRouter } from 'next/navigation';

import { AppDataGrid, DirectionTile, Money } from '@/shared/components/data';
import { EmptyState } from '@/shared/components/feedback';
import { NavChevron } from '@/shared/components/ui/nav-chevron';
import { Panel } from '@/shared/components/ui/panel';
import { APP_ROUTES } from '@/shared/constants';
import { RECENT_COLUMNS } from '@/features/dashboard/components/recent-movimientos-columns';
import { DASHBOARD_COPY as C } from '@/features/dashboard/constants/copy';
import type { RecentMovimientoRow } from '@/features/dashboard/helpers/view-model';

const rowId = (row: RecentMovimientoRow): string => row.id;

/** Fila mobile: título, "fecha · responsable" y monto con signo. */
function MobileRow({ row }: { readonly row: RecentMovimientoRow }) {
  return (
    <div className="group flex min-h-14 items-center gap-3 px-4 py-2.5">
      <DirectionTile direction={row.direction} decorative />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink">{row.title}</p>
        <p className="truncate text-xs text-ink-subtle">{`${row.fecha} · ${row.responsable}`}</p>
      </div>
      <Money amount={row.amount} sign="auto" className="shrink-0 text-sm font-medium" />
      <NavChevron />
    </div>
  );
}

/** Últimos movimientos: tabla densa en desktop, lista bajo 860px. Cada fila abre el movimiento. */
export function RecentMovimientosPanel({ rows, className }: { readonly rows: readonly RecentMovimientoRow[]; readonly className?: string }) {
  const router = useRouter();
  return (
    <Panel title={C.RECENT} action={{ label: C.SEE_ALL, href: APP_ROUTES.MOVIMIENTOS }} flush className={className}>
      <AppDataGrid
        ariaLabel={C.RECENT_LABEL}
        columns={RECENT_COLUMNS}
        data={rows}
        getRowId={rowId}
        pagination="none"
        onRowClick={(row) => router.push(row.href)}
        mobileRow={(row) => <MobileRow row={row} />}
        emptyState={<EmptyState title={C.NO_RECENT} />}
      />
    </Panel>
  );
}
