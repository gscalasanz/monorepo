import { Info } from 'lucide-react';

import { KeyValueList, Money } from '@/shared/components/data';
import type { Movimiento } from '@/shared/domain';
import { formatDate } from '@/shared/time';
import { MOVIMIENTOS_COPY as C } from '@/features/movimientos/constants/copy';
import { MONEY_DECIMALS } from '@/features/movimientos/constants/movimientos';
import {
  conceptoLabel,
  isIngreso,
  medioPagoLabel,
  tipoLabel,
} from '@/features/movimientos/helpers/view-model';

/** Banner + "Datos del Movimiento" (solo lectura, inmutables por integridad contable). */
export function MovimientoSummary({
  movimiento,
}: {
  readonly movimiento: Movimiento;
}) {
  const items = [
    { label: C.TIPO, value: tipoLabel(movimiento) },
    {
      label: C.MONTO,
      value: (
        <Money
          amount={movimiento.monto}
          sign={isIngreso(movimiento) ? 'in' : 'out'}
          decimals={MONEY_DECIMALS}
        />
      ),
    },
    { label: C.CONCEPTO, value: conceptoLabel(movimiento) },
    { label: C.MEDIO_PAGO, value: medioPagoLabel(movimiento) },
    { label: C.FECHA, value: formatDate(movimiento.fecha) },
    {
      label: C.RESPONSABLE,
      value: movimiento.responsable?.nombre || C.NOT_AVAILABLE,
    },
  ];
  return (
    <div className="flex flex-col gap-4">
      <p className="flex items-start gap-2.5 rounded-md bg-info-soft px-3 py-2.5 text-sm text-ink">
        <Info className="mt-0.5 size-4 shrink-0 text-info" aria-hidden />
        <span>{C.EDIT_BANNER}</span>
      </p>
      <section
        aria-labelledby="movimiento-summary-title"
        className="flex flex-col gap-3"
      >
        <h2
          id="movimiento-summary-title"
          className="text-sm font-semibold text-ink"
        >
          {C.SUMMARY_TITLE}
        </h2>
        <KeyValueList items={items} columns={3} />
      </section>
    </div>
  );
}
