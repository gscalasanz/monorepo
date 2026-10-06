import { KpiStrip, type KpiItem } from '@/shared/components/charts';
import {
  KeyValueList,
  Money,
  type KeyValueItem,
} from '@/shared/components/data';
import type { CampamentoDetalle, CampamentoKpis } from '@/shared/domain';
import { ProgressBar } from '@/features/campamentos/components/progress-bar';
import { DETAIL_COPY as C } from '@/features/campamentos/constants/copy';
import { recaudacionPercent } from '@/features/campamentos/helpers/detalle';

function kpiItems(kpis: CampamentoKpis): readonly KpiItem[] {
  const money = (amount: number) => <Money amount={amount} size="figure-md" />;
  return [
    {
      id: 'aRecaudar',
      label: C.KPI_A_RECAUDAR,
      value: money(kpis.totalARecaudar),
    },
    {
      id: 'recaudado',
      label: C.KPI_RECAUDADO,
      value: money(kpis.totalRecaudado),
    },
    { id: 'gastado', label: C.KPI_GASTADO, value: money(kpis.totalGastado) },
    {
      id: 'reembolsos',
      label: C.KPI_REEMBOLSOS,
      value: money(kpis.totalPendienteReembolso),
    },
    { id: 'balance', label: C.KPI_BALANCE, value: money(kpis.balance) },
  ];
}

function infoItems(detalle: CampamentoDetalle): readonly KeyValueItem[] {
  const { campamento, kpis } = detalle;
  return [
    {
      label: C.COSTO_POR_PERSONA,
      value: <Money amount={campamento.costoPorPersona} />,
    },
    ...(campamento.cuotasBase
      ? [{ label: C.CUOTAS_SUGERIDAS, value: campamento.cuotasBase }]
      : []),
    { label: C.PARTICIPANTES, value: kpis.cantidadParticipantes },
  ];
}

/** Info (descripción, costo, cuotas, participantes) + KPIs + barra de recaudación. */
export function DetailSummary({
  detalle,
}: {
  readonly detalle: CampamentoDetalle;
}) {
  const items = infoItems(detalle);
  return (
    <div className="flex flex-col gap-4">
      <section className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 shadow-xs md:p-[18px]">
        {detalle.campamento.descripcion && (
          <p className="text-sm text-ink-muted">
            {detalle.campamento.descripcion}
          </p>
        )}
        <KeyValueList items={items} columns={items.length === 3 ? 3 : 2} />
      </section>
      <section aria-label={C.KPIS_LABEL} className="flex flex-col gap-3">
        <KpiStrip items={kpiItems(detalle.kpis)} ariaLabel={C.KPIS_LABEL} />
        <ProgressBar
          label={C.RECAUDACION}
          percent={recaudacionPercent(detalle.kpis)}
          className="rounded-xl border border-border bg-surface px-4 py-3 shadow-xs"
        />
      </section>
    </div>
  );
}
