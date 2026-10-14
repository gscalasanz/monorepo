import { CircleCheck } from 'lucide-react';

import {
  KpiStrip,
  ProgressTrack,
  type KpiItem,
} from '@/shared/components/charts';
import { Money } from '@/shared/components/data';
import type { Inscripcion } from '@/shared/domain';
import { DETAIL_COPY as C } from '@/features/inscripciones/constants/copy';
import { PERCENT } from '@/features/inscripciones/constants/inscripciones';
import {
  montoAPagar,
  progressPercent,
} from '@/features/inscripciones/helpers/detail';

const money = (amount: number) => <Money amount={amount} size="figure-md" />;

/** Barra de avance bajo "Pagado": % completado y cantidad de pagos. */
function PagadoFooter({ inscripcion }: { readonly inscripcion: Inscripcion }) {
  const percent = progressPercent(inscripcion);
  const pagos = inscripcion.movimientos.length;
  return (
    <span className="grid gap-1 text-xs text-ink-muted tabular-nums">
      <ProgressTrack
        value={percent}
        max={PERCENT}
        ariaLabel={C.progressLabel(percent)}
        color="var(--color-success)"
      />
      <span className="flex justify-between gap-2">
        <span>{C.progress(percent)}</span>
        {pagos > 0 ? <span>{C.pagosCount(pagos)}</span> : null}
      </span>
    </span>
  );
}

function SaldoValue({ saldo }: { readonly saldo: number }) {
  if (saldo > 0) return <Money amount={saldo} tone="debt" size="figure-md" />;
  return (
    <span className="inline-flex items-center gap-1.5 text-success">
      <CircleCheck aria-hidden className="size-5" />
      {C.AL_DIA}
    </span>
  );
}

function kpiItems(inscripcion: Inscripcion): readonly KpiItem[] {
  return [
    {
      id: 'inscripcion',
      label: C.INSCRIPCION,
      hint: C.HINT_INSCRIPCION,
      value: money(inscripcion.montoTotal),
    },
    {
      id: 'bonificacion',
      label: C.BONIFICACION,
      hint: C.HINT_BONIFICACION,
      value: money(inscripcion.montoBonificado),
    },
    {
      id: 'aPagar',
      label: C.A_PAGAR,
      hint: C.HINT_A_PAGAR,
      value: money(montoAPagar(inscripcion)),
    },
    {
      id: 'pagado',
      label: C.PAGADO_LABEL,
      hint: C.HINT_PAGADO,
      value: money(inscripcion.montoPagado),
      footer: <PagadoFooter inscripcion={inscripcion} />,
    },
    {
      id: 'saldo',
      label: C.SALDO_PENDIENTE,
      hint: C.HINT_SALDO,
      value: <SaldoValue saldo={inscripcion.saldoPendiente} />,
    },
  ];
}

/** UN panel con la plata de la inscripción; el rojo queda solo en el saldo pendiente. */
export function InscripcionKpis({
  inscripcion,
}: {
  readonly inscripcion: Inscripcion;
}) {
  return <KpiStrip ariaLabel={C.KPIS_LABEL} items={kpiItems(inscripcion)} />;
}
