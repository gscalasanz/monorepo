import {
  KpiStrip,
  ProgressTrack,
  type KpiItem,
} from '@/shared/components/charts';
import { Money } from '@/shared/components/data';
import type { CampamentoDetalle, CampamentoKpis } from '@/shared/domain';
import { DETAIL_COPY as C } from '@/features/campamentos/constants/copy';
import { recaudacionPercent } from '@/features/campamentos/helpers/detalle';

const money = (amount: number) => <Money amount={amount} size="figure-md" />;

/** Barra de recaudación bajo "Recaudado" (recaudado / a recaudar). */
function RecaudacionFooter({ kpis }: { readonly kpis: CampamentoKpis }) {
  return (
    <span className="flex items-center gap-2 text-xs text-ink-muted tabular-nums">
      <ProgressTrack
        value={kpis.totalRecaudado}
        max={kpis.totalARecaudar}
        ariaLabel={C.RECAUDACION}
        color="var(--color-success)"
        className="flex-1"
      />
      {recaudacionPercent(kpis)}%
    </span>
  );
}

function infoItems(
  campamento: CampamentoDetalle['campamento'],
  kpis: CampamentoKpis,
): readonly KpiItem[] {
  const cuotas: readonly KpiItem[] = campamento.cuotasBase
    ? [
        {
          id: 'cuotas',
          label: C.CUOTAS_SUGERIDAS,
          hint: C.HINT_CUOTAS,
          value: campamento.cuotasBase,
        },
      ]
    : [];
  return [
    {
      id: 'costo',
      label: C.COSTO_POR_PERSONA,
      hint: C.HINT_COSTO,
      value: money(campamento.costoPorPersona),
    },
    ...cuotas,
    {
      id: 'participantes',
      label: C.PARTICIPANTES,
      hint: C.HINT_PARTICIPANTES,
      value: kpis.cantidadParticipantes,
    },
  ];
}

function moneyItems(kpis: CampamentoKpis): readonly KpiItem[] {
  return [
    {
      id: 'aRecaudar',
      label: C.KPI_A_RECAUDAR,
      hint: C.HINT_A_RECAUDAR,
      value: money(kpis.totalARecaudar),
    },
    {
      id: 'recaudado',
      label: C.KPI_RECAUDADO,
      hint: C.HINT_RECAUDADO,
      value: money(kpis.totalRecaudado),
      footer: <RecaudacionFooter kpis={kpis} />,
    },
    {
      id: 'gastado',
      label: C.KPI_GASTADO,
      hint: C.HINT_GASTADO,
      value: money(kpis.totalGastado),
    },
    {
      id: 'reembolsos',
      label: C.KPI_REEMBOLSOS,
      hint: C.HINT_REEMBOLSOS,
      value: money(kpis.totalPendienteReembolso),
    },
    {
      id: 'balance',
      label: C.KPI_BALANCE,
      hint: C.HINT_BALANCE,
      value: money(kpis.balance),
    },
  ];
}

/** UN panel: costo, cuotas y participantes + plata del campamento, cada cifra con su ⓘ. */
export function CampamentoKpis({
  detalle,
}: {
  readonly detalle: CampamentoDetalle;
}) {
  return (
    <KpiStrip
      ariaLabel={C.KPIS_LABEL}
      items={[
        ...infoItems(detalle.campamento, detalle.kpis),
        ...moneyItems(detalle.kpis),
      ]}
    />
  );
}
