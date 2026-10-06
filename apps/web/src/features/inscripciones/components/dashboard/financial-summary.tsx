import { Money } from '@/shared/components/data';
import { Panel } from '@/shared/components/ui/panel';
import type { InscripcionesConsolidado } from '@/shared/domain';
import { DASHBOARD_COPY as C } from '@/features/inscripciones/constants/copy';
import {
  financialMetrics,
  formatPercent,
  type FinancialKey,
} from '@/features/inscripciones/helpers/consolidado';
import {
  ProgressMeter,
  type MeterTone,
} from '@/features/inscripciones/components/shared/progress-meter';

const METRIC_TONE: Readonly<Record<FinancialKey, MeterTone>> = {
  montoEsperado: 'info',
  montoPagado: 'success',
  montoAdeudado: 'warning',
  montoBonificado: 'danger',
};

/** "Resumen Financiero": esperado, pagado, adeudado y bonificado (% sobre esperado). */
export function FinancialSummary({
  financiero,
}: {
  readonly financiero: InscripcionesConsolidado['financiero'];
}) {
  return (
    <Panel title={C.FINANCIAL} flush>
      <dl className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
        {financialMetrics(financiero).map((metric) => (
          <div
            key={metric.key}
            className="grid content-start gap-1.5 bg-surface px-4 py-4 md:px-[18px]"
          >
            <dt className="text-[13px] text-ink-muted">{metric.label}</dt>
            <dd className="grid gap-2">
              <Money amount={metric.value} size="figure-md" />
              {metric.percentage === null ? null : (
                <span className="grid gap-1">
                  <ProgressMeter
                    value={metric.percentage}
                    tone={METRIC_TONE[metric.key]}
                    label={`${metric.label}: ${formatPercent(metric.percentage)}%`}
                  />
                  <span className="text-xs text-ink-subtle tabular-nums">
                    {formatPercent(metric.percentage)}%
                  </span>
                </span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}
