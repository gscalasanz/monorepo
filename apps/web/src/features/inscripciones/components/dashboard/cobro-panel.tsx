import { DistributionBar } from '@/shared/components/charts';
import { formatMoney } from '@/shared/format';
import { Panel } from '@/shared/components/ui/panel';
import type { InscripcionesConsolidado } from '@/shared/domain';
import { DASHBOARD_COPY as C } from '@/features/inscripciones/constants/copy';
import {
  cobradoPercent,
  formatPercent,
} from '@/features/inscripciones/helpers/consolidado';

type Financiero = InscripcionesConsolidado['financiero'];

function segmentsOf(financiero: Financiero) {
  return [
    {
      label: C.COBRADO,
      value: financiero.montoPagado,
      color: 'var(--color-success)',
    },
    {
      label: C.PENDIENTE,
      value: financiero.montoAdeudado,
      color: 'var(--color-danger)',
    },
    {
      label: C.BONIFICADO,
      value: financiero.montoBonificado,
      color: 'var(--color-info)',
    },
  ];
}

/** "% Cobrado": cifra + UNA barra apilada cobrado / pendiente / bonificado. */
export function CobroPanel({
  financiero,
}: {
  readonly financiero: Financiero;
}) {
  const segments = segmentsOf(financiero);
  const rounded = formatPercent(cobradoPercent(financiero), 0);
  const detail = segments
    .map((segment) => `${segment.label} ${formatMoney(segment.value)}`)
    .join(', ');
  return (
    <Panel title={C.COBRADO_TITLE}>
      <div className="grid gap-4">
        <p className="flex items-baseline gap-2">
          <span className="text-[32px] leading-10 font-semibold tracking-[-0.025em] text-ink tabular-nums">
            {rounded}%
          </span>
          <span className="text-sm text-ink-muted">
            {C.COBRADO_DEL_ESPERADO}
          </span>
        </p>
        <DistributionBar segments={segments} ariaLabel={C.cobroLabel(detail)} />
      </div>
    </Panel>
  );
}
