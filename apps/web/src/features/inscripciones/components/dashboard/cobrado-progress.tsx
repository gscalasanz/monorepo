import { KeyValueList, Money } from '@/shared/components/data';
import { Panel } from '@/shared/components/ui/panel';
import type { InscripcionesConsolidado } from '@/shared/domain';
import { DASHBOARD_COPY as C } from '@/features/inscripciones/constants/copy';
import {
  cobradoPercent,
  formatPercent,
} from '@/features/inscripciones/helpers/consolidado';
import { ProgressMeter } from '@/features/inscripciones/components/shared/progress-meter';

/** "% Cobrado": avance de cobro + Esperado / Cobrado / Pendiente. */
export function CobradoProgress({
  financiero,
}: {
  readonly financiero: InscripcionesConsolidado['financiero'];
}) {
  const percent = cobradoPercent(financiero);
  const rounded = formatPercent(percent, 0);
  return (
    <Panel title={C.COBRADO_TITLE}>
      <div className="grid gap-4">
        <div className="flex items-baseline gap-2">
          <span className="text-[32px] leading-10 font-semibold tracking-[-0.025em] text-ink tabular-nums">
            {rounded}%
          </span>
          <span className="text-sm text-ink-muted">{C.COBRADO}</span>
        </div>
        <ProgressMeter
          value={percent}
          tone="success"
          label={C.cobradoLabel(rounded)}
        />
        <KeyValueList
          columns={3}
          items={[
            {
              label: C.ESPERADO_SHORT,
              value: <Money amount={financiero.montoEsperado} />,
            },
            {
              label: C.COBRADO,
              value: (
                <Money
                  amount={financiero.montoPagado}
                  className="text-money-in"
                />
              ),
            },
            {
              label: C.PENDIENTE,
              value: <Money amount={financiero.montoAdeudado} tone="debt" />,
            },
          ]}
        />
      </div>
    </Panel>
  );
}
