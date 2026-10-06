'use client';

import { LoadingState } from '@/shared/components/feedback';
import { PageHeader } from '@/shared/layout';
import { DASHBOARD_COPY as C } from '@/features/dashboard/constants/copy';
import { DashboardKpis } from '@/features/dashboard/components/dashboard-kpis';
import { FondosRamaPanel } from '@/features/dashboard/components/fondos-rama-panel';
import { QuickActionsPanel } from '@/features/dashboard/components/quick-actions-panel';
import { RecentMovimientosPanel } from '@/features/dashboard/components/recent-movimientos-panel';
import { UpcomingEventosPanel } from '@/features/dashboard/components/upcoming-eventos-panel';
import { useDashboard } from '@/features/dashboard/hooks/use-dashboard';

/** Página principal: saldos, accesos, próximos eventos, movimientos y fondos. */
export function DashboardView() {
  const { isLoading, kpis, fondos, eventos, movimientos } = useDashboard();
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <PageHeader title={C.TITLE} subtitle={C.SUBTITLE} />
      {isLoading ? (
        <LoadingState variant="skeleton" rows={6} />
      ) : (
        <>
          <DashboardKpis kpis={kpis} />
          <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
            <QuickActionsPanel />
            <UpcomingEventosPanel eventos={eventos} />
          </div>
          <div className="grid gap-4 md:gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <RecentMovimientosPanel rows={movimientos} />
            <FondosRamaPanel rows={fondos} />
          </div>
        </>
      )}
    </div>
  );
}
