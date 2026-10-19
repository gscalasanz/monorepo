import { Money } from '@/shared/components/data';
import { KpiStrip, type KpiItem } from '@/shared/components/charts';
import type { InscripcionesConsolidado } from '@/shared/domain';
import { DASHBOARD_COPY as C } from '@/features/inscripciones/constants/copy';
import {
  financialMetrics,
  formatPercent,
  type FinancialKey,
} from '@/features/inscripciones/helpers/consolidado';

const TONE: Partial<Record<FinancialKey, 'debt'>> = { montoAdeudado: 'debt' };

function kpiItems(consolidado: InscripcionesConsolidado): readonly KpiItem[] {
  const money = financialMetrics(consolidado.financiero).map((metric) => ({
    id: metric.key,
    label: metric.label,
    value: (
      <Money amount={metric.value} size="figure-md" tone={TONE[metric.key]} />
    ),
    footer:
      metric.percentage === null ? undefined : (
        <span className="text-xs text-ink-subtle tabular-nums">
          {formatPercent(metric.percentage)}%
        </span>
      ),
  }));
  const inscriptos: KpiItem = {
    id: 'total',
    label: C.INSCRIPTOS,
    value: consolidado.total,
    footer: (
      <span className="text-xs text-ink-subtle">
        {consolidado.filtros.ano ?? C.ALL_YEARS}
      </span>
    ),
  };
  return [inscriptos, ...money];
}

/** Tira de métricas: inscriptos + esperado / pagado / adeudado / bonificado (% sobre esperado). */
export function DashboardKpis({
  consolidado,
}: {
  readonly consolidado: InscripcionesConsolidado;
}) {
  return <KpiStrip ariaLabel={C.KPIS_LABEL} items={kpiItems(consolidado)} />;
}
