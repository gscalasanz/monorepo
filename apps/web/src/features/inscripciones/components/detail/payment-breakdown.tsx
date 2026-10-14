import type { ReactNode } from 'react';

import { InfoHint } from '@/shared/components/ui/info-hint';
import { Money } from '@/shared/components/data';
import type { Inscripcion } from '@/shared/domain';
import { DETAIL_COPY as C } from '@/features/inscripciones/constants/copy';
import { montoAPagar } from '@/features/inscripciones/helpers/detail';

interface Cell {
  readonly id: string;
  readonly label: string;
  readonly hint: string;
  readonly value: ReactNode;
}

function cellsOf(inscripcion: Inscripcion): readonly Cell[] {
  return [
    {
      id: 'inscripcion',
      label: C.INSCRIPCION,
      hint: C.HINT_INSCRIPCION,
      value: <Money amount={inscripcion.montoTotal} />,
    },
    {
      id: 'bonificacion',
      label: C.BONIFICACION,
      hint: C.HINT_BONIFICACION,
      value: (
        <Money
          amount={inscripcion.montoBonificado}
          sign={inscripcion.montoBonificado > 0 ? 'out' : undefined}
        />
      ),
    },
    {
      id: 'aPagar',
      label: C.A_PAGAR,
      hint: C.HINT_A_PAGAR,
      value: <Money amount={montoAPagar(inscripcion)} />,
    },
    {
      id: 'pagado',
      label: C.PAGADO_LABEL,
      hint: C.HINT_PAGADO,
      value: (
        <Money amount={inscripcion.montoPagado} className="text-money-in" />
      ),
    },
  ];
}

/** Desglose (2×2 con hairlines): inscripción − bonificación = a pagar · pagado. */
export function PaymentBreakdown({
  inscripcion,
}: {
  readonly inscripcion: Inscripcion;
}) {
  return (
    <dl className="grid grid-cols-2 gap-px border-t border-border bg-border lg:border-t-0 lg:border-l">
      {cellsOf(inscripcion).map((cell) => (
        <div
          key={cell.id}
          className="flex flex-col justify-center gap-1.5 bg-surface px-4 py-4 md:px-6 md:py-5"
        >
          <dt className="flex items-center gap-1.5 text-[13px] text-ink-muted">
            {cell.label}
            <InfoHint label={cell.label} text={cell.hint} />
          </dt>
          <dd className="text-xl leading-7 font-semibold tracking-[-0.02em] text-ink tabular-nums">
            {cell.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
