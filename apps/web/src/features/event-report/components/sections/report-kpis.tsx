import { KpiStrip, type KpiItem } from '@/shared/components/charts';
import { EVENT_REPORT_COPY } from '@/features/event-report/constants/copy';
import type { ReportKpi } from '@/features/event-report/models/report';

function toKpiItem(kpi: ReportKpi): KpiItem {
  return {
    id: kpi.id,
    label: kpi.label,
    value: (
      <>
        {kpi.value}
        {kpi.sub ? (
          <span className="block text-xs leading-4 font-normal tracking-normal whitespace-normal text-ink-subtle">
            {kpi.sub}
          </span>
        ) : null}
      </>
    ),
  };
}

/** "Indicadores clave": tira de métricas con su bajada. */
export function ReportKpis({ kpis }: { readonly kpis: readonly ReportKpi[] }) {
  const title = EVENT_REPORT_COPY.kpis.title;
  return (
    <section className="grid gap-2" aria-labelledby="report-kpis-title">
      <h2 id="report-kpis-title" className="text-sm font-semibold text-ink">
        {title}
      </h2>
      <KpiStrip ariaLabel={title} items={kpis.map(toKpiItem)} />
    </section>
  );
}
