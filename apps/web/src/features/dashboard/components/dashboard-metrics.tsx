import { CHART_COLORS, DistributionBar, KpiStrip, type KpiItem } from '@/shared/components/charts';
import { movimientosHref } from '@/shared/constants';
import { TIPO_MOVIMIENTO } from '@/shared/domain';
import { Money } from '@/shared/components/data';
import { DASHBOARD_COPY as C } from '@/features/dashboard/constants/copy';
import { DEBTORS_REPORT_HREF, INSCRIPCIONES_HREF, INSCRIPCION_COLORS } from '@/features/dashboard/constants/dashboard';
import { monthBounds, monthName, type FlowMetric } from '@/features/dashboard/helpers/cash-flow';
import type { InscripcionesSummary } from '@/features/dashboard/helpers/inscripciones-summary';

export interface DashboardMetricsProps {
  /** `undefined` mientras carga el historial: la cifra muestra el placeholder. */
  readonly ingresos: FlowMetric | undefined;
  readonly egresos: FlowMetric | undefined;
  readonly currentMonth: string | undefined;
  readonly porCobrar: number;
  readonly inscripciones: InscripcionesSummary;
  readonly ano: number;
}

interface FlowItemParams {
  readonly id: string;
  readonly label: string;
  readonly metric: FlowMetric | undefined;
  readonly tone: 'positive' | 'neutral';
  readonly color: string;
  /** Lista de movimientos de ese tipo en el mes. */
  readonly href: string | undefined;
}

function flowItem({ id, label, metric, tone, color, href }: FlowItemParams): KpiItem {
  const delta = metric?.delta;
  return {
    id,
    label,
    value: <Money amount={metric?.current} size="figure-md" />,
    delta: delta && metric?.previousMonth
      ? { ...delta, tone: delta.direction === 'up' ? tone : 'neutral', comparison: C.VS_MONTH(monthName(metric.previousMonth)) }
      : undefined,
    sparkline: metric?.sparkline,
    sparklineColor: color,
    href,
  };
}

function InscripcionesMeter({ summary }: { readonly summary: InscripcionesSummary }) {
  return (
    <DistributionBar
      format={String}
      legendClassName="grid-cols-2 gap-x-3"
      segments={[
        { label: C.INSC_PAGADAS, value: summary.pagadas, color: INSCRIPCION_COLORS.pagadas },
        { label: C.INSC_BONIFICADAS, value: summary.bonificadas, color: INSCRIPCION_COLORS.bonificadas },
        { label: C.INSC_PARCIALES, value: summary.parciales, color: INSCRIPCION_COLORS.parciales },
        { label: C.INSC_PENDIENTES, value: summary.pendientes, color: INSCRIPCION_COLORS.pendientes },
      ]}
    />
  );
}

function inscripcionesItem({ summary, ano }: { readonly summary: InscripcionesSummary; readonly ano: number }): KpiItem {
  return {
    id: 'inscripciones',
    label: C.METRIC_INSCRIPCIONES(ano),
    value: (
      <>
        {summary.alDia}
        <span className="ml-1.5 text-[13px] font-normal tracking-normal text-ink-muted">{C.INSCRIPCIONES_AL_DIA(summary.total)}</span>
      </>
    ),
    footer: summary.total > 0 ? <InscripcionesMeter summary={summary} /> : undefined,
    href: INSCRIPCIONES_HREF,
  };
}

/** Franja de métricas (un solo panel con hairlines): ingresos, egresos, deuda a cobrar e inscripciones. */
export function DashboardMetrics({ ingresos, egresos, currentMonth, porCobrar, inscripciones, ano }: DashboardMetricsProps) {
  const month = currentMonth ? monthName(currentMonth) : '';
  const link = (tipo: string) => (currentMonth ? movimientosHref({ tipo, ...monthBounds(currentMonth) }) : undefined);
  return (
    <KpiStrip
      ariaLabel={C.METRICS_LABEL}
      items={[
        flowItem({ id: 'ingresos', label: C.METRIC_INGRESOS(month), metric: ingresos, tone: 'positive', color: CHART_COLORS.moneyIn, href: link(TIPO_MOVIMIENTO.INGRESO) }),
        flowItem({ id: 'egresos', label: C.METRIC_EGRESOS(month), metric: egresos, tone: 'neutral', color: CHART_COLORS.moneyOut, href: link(TIPO_MOVIMIENTO.EGRESO) }),
        { id: 'deuda', label: C.METRIC_DEUDA, value: <Money amount={porCobrar} size="figure-md" />, href: DEBTORS_REPORT_HREF },
        inscripcionesItem({ summary: inscripciones, ano }),
      ]}
    />
  );
}
