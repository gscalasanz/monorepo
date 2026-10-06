import { KpiStrip, type KpiItem } from '@/shared/components/charts';
import { Money } from '@/shared/components/data';
import { REPORTES_COPY as C } from '@/features/reportes/constants/copy';
import type { DeudasSummary } from '@/features/reportes/helpers/deudas';

export function DeudasKpis({ summary }: { readonly summary: DeudasSummary }) {
  const items: readonly KpiItem[] = [
    { id: 'personas', label: C.KPI_PERSONAS, value: summary.personas },
    {
      id: 'total',
      label: C.KPI_TOTAL,
      value: <Money amount={summary.totalDeuda} tone="debt" size="figure-md" />,
    },
    { id: 'docs', label: C.KPI_DOCS, value: summary.docsFaltantes },
  ];
  return <KpiStrip items={items} ariaLabel={C.KPIS_LABEL} />;
}
