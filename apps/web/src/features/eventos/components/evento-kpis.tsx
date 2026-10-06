import { CircleCheck } from 'lucide-react';

import { KpiStrip } from '@/shared/components/charts';
import { Money } from '@/shared/components/data';
import { Panel } from '@/shared/components/ui/panel';
import type { Evento, EventoKpis as Kpis, StockEntrega } from '@/shared/domain';
import { EVENTOS_COPY } from '@/features/eventos/constants/copy';
import { kpiConfigsFor } from '@/features/eventos/helpers/evento-detail';
import {
  aggregateProductoKpis,
  isEntregaCompleta,
} from '@/features/eventos/helpers/entregas';

const C = EVENTOS_COPY.detail;

/** Recaudado · Ganancia Ventas · Gastado · Reembolsos Pendientes · Balance (+ recupero). */
export function EventoKpis({
  evento,
  kpis,
}: {
  readonly evento: Evento;
  readonly kpis: Kpis | undefined;
}) {
  return (
    <KpiStrip
      ariaLabel={C.kpisAria}
      items={kpiConfigsFor(evento).map((config) => ({
        id: config.id,
        label: config.label,
        value: <Money amount={kpis?.[config.id] ?? 0} size="figure-md" />,
      }))}
    />
  );
}

/** "entregado / vendido" por producto (solo venta y con ventas cargadas). */
export function EntregasPorProducto({
  stock,
}: {
  readonly stock: readonly StockEntrega[];
}) {
  const kpis = aggregateProductoKpis(stock);
  if (kpis.length === 0) return null;
  return (
    <Panel title={C.entregasPorProducto}>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {kpis.map((kpi) => (
          <li
            key={kpi.productoId}
            className="flex flex-col gap-1 rounded-lg border border-border p-3"
          >
            <span className="truncate text-[13px] text-ink-muted">
              {kpi.productoNombre}
            </span>
            <span className="flex items-center gap-1.5 text-lg font-semibold text-ink tabular-nums">
              {kpi.cantidadEntregada}
              <span className="text-ink-subtle">/</span>
              {kpi.cantidadVendida}
              {isEntregaCompleta(kpi) && kpi.cantidadVendida > 0 && (
                <CircleCheck aria-hidden className="size-4 text-success" />
              )}
            </span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
