import { CircleAlert } from 'lucide-react';

import { Money } from '@/shared/components/data';
import { PAGO_COPY as C } from '@/features/inscripciones/constants/copy';
import type { PagoCreateSummary } from '@/features/inscripciones/helpers/pago';

interface PagoSummaryProps {
  readonly efectivo: number;
  readonly saldo: number;
  readonly pendiente: number;
  readonly summary: PagoCreateSummary;
}

/** Efectivo + Saldo = Total · Restante (o el error si supera el pendiente). */
export function PagoSummary({
  efectivo,
  saldo,
  pendiente,
  summary,
}: PagoSummaryProps) {
  if (summary.excedePendiente) {
    return (
      <p
        role="alert"
        className="flex items-start gap-2 rounded-lg bg-danger-soft px-3 py-2.5 text-sm text-danger"
      >
        <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
        {C.excedePendiente(pendiente)}
      </p>
    );
  }
  return (
    <div
      aria-live="polite"
      className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-recessed px-3 py-2.5 text-[13px]"
    >
      <span className="flex flex-wrap items-center gap-x-2 text-ink-muted">
        {C.EFECTIVO} <Money amount={efectivo} className="text-ink" />
        <span aria-hidden>+</span>
        {C.SALDO} <Money amount={saldo} className="text-ink" />
        <span aria-hidden>=</span>
        {C.TOTAL}{' '}
        <Money amount={summary.total} className="font-semibold text-ink" />
      </span>
      <span className="flex items-center gap-2 text-ink-muted">
        {C.RESTANTE}
        <Money
          amount={summary.restante}
          tone={summary.restante > 0 ? 'debt' : undefined}
          className="font-semibold"
        />
      </span>
    </div>
  );
}
