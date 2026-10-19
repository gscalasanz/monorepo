'use client';

import { useMemo } from 'react';

import { LoadingState } from '@/shared/components/feedback';
import { DashboardHeader } from '@/features/dashboard/components/dashboard-header';
import { DashboardMetrics } from '@/features/dashboard/components/dashboard-metrics';
import { DebtorsPanel } from '@/features/dashboard/components/debtors-panel';
import { FondosRamaPanel } from '@/features/dashboard/components/fondos-rama-panel';
import { RecentMovimientosPanel } from '@/features/dashboard/components/recent-movimientos-panel';
import { TreasuryPanel } from '@/features/dashboard/components/treasury-panel';
import { buildFlowMetric } from '@/features/dashboard/helpers/cash-flow';
import { useCashFlow } from '@/features/dashboard/hooks/use-cash-flow';
import { useDashboard } from '@/features/dashboard/hooks/use-dashboard';

const GRID = 'grid gap-3 md:gap-4 lg:grid-cols-12';

/** Inicio rediseñado (Insignia): tesorería → métricas → movimientos y deudores. Los próximos eventos viven en la franja de métricas. */
export function DashboardView() {
  const dash = useDashboard();
  const cashFlow = useCashFlow(dash.hasConsolidado ? dash.treasury.total : undefined);
  const ready = cashFlow.monthly.length > 0;
  const ingresos = useMemo(() => (ready ? buildFlowMetric({ flow: cashFlow.monthly, key: 'ingresos' }) : undefined), [ready, cashFlow.monthly]);
  const egresos = useMemo(() => (ready ? buildFlowMetric({ flow: cashFlow.monthly, key: 'egresos' }) : undefined), [ready, cashFlow.monthly]);
  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <DashboardHeader lastMovimientoAt={dash.lastMovimientoAt} />
      {dash.isLoading ? (
        <LoadingState variant="skeleton" rows={6} />
      ) : (
        <>
          <div className={GRID}>
            <TreasuryPanel treasury={dash.treasury} currentMonth={cashFlow.monthly.at(-1)} className="lg:col-span-8" />
            <FondosRamaPanel rows={dash.fondos} className="lg:col-span-4" />
          </div>
          <DashboardMetrics
            ingresos={ingresos}
            egresos={egresos}
            currentMonth={cashFlow.monthly.at(-1)?.month}
            upcoming={dash.upcoming}
            inscripciones={dash.inscripciones}
            ano={dash.inscripcionesAno}
          />
          <div className={GRID}>
            <RecentMovimientosPanel rows={dash.movimientos} className="lg:col-span-8" />
            <DebtorsPanel summary={dash.debtors} className="lg:col-span-4" />
          </div>
        </>
      )}
    </div>
  );
}
