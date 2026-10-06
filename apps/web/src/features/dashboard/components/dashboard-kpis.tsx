import { KpiStrip } from '@/shared/components/charts';
import { Money } from '@/shared/components/data';
import { DASHBOARD_COPY as C } from '@/features/dashboard/constants/copy';
import type { DashboardKpi } from '@/features/dashboard/helpers/view-model';

/** Tira de 6 saldos (dos filas de 3 en desktop). */
export function DashboardKpis({ kpis }: { kpis: readonly DashboardKpi[] }) {
  return (
    <KpiStrip
      ariaLabel={C.KPIS_LABEL}
      items={kpis.map((kpi) => ({
        id: kpi.id,
        label: kpi.label,
        value: <Money amount={kpi.value} size="figure-md" />,
      }))}
    />
  );
}
