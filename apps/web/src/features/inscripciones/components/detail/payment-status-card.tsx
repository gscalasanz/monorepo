import { CircleCheck } from 'lucide-react';

import { ProgressTrack } from '@/shared/components/charts';
import { Money } from '@/shared/components/data';
import type { Inscripcion } from '@/shared/domain';
import { cn } from '@/shared/lib/utils';
import { DETAIL_COPY as C } from '@/features/inscripciones/constants/copy';
import { PERCENT } from '@/features/inscripciones/constants/inscripciones';
import {
  montoAPagar,
  progressPercent,
} from '@/features/inscripciones/helpers/detail';
import { PaymentBreakdown } from '@/features/inscripciones/components/detail/payment-breakdown';

type Props = { readonly inscripcion: Inscripcion };

/** La respuesta de un vistazo: "Pagada" o "Debe $X", con lo pagado sobre el total. */
function Headline({ inscripcion }: Props) {
  if (inscripcion.saldoPendiente <= 0) {
    return (
      <span className="flex items-center gap-2.5 text-[34px] leading-10 font-semibold tracking-[-0.035em] text-success md:text-[40px] md:leading-[44px]">
        <CircleCheck
          aria-hidden
          className="size-8 md:size-9"
          strokeWidth={2.25}
        />
        {C.PAGADA}
      </span>
    );
  }
  return (
    <span className="flex flex-col gap-1">
      <span className="text-sm font-medium text-ink-muted">{C.DEBE}</span>
      <Money amount={inscripcion.saldoPendiente} tone="debt" size="figure" />
    </span>
  );
}

function Progress({ inscripcion }: Props) {
  const percent = progressPercent(inscripcion);
  const pagos = inscripcion.movimientos.length;
  return (
    <div className="grid gap-2">
      <p className="text-[15px] text-ink">
        {C.PAGO_PREFIX}{' '}
        <Money amount={inscripcion.montoPagado} className="font-semibold" />{' '}
        {C.PAGO_DE}{' '}
        <Money amount={montoAPagar(inscripcion)} className="font-semibold" />
      </p>
      <ProgressTrack
        value={percent}
        max={PERCENT}
        ariaLabel={C.progressLabel(percent)}
        color="var(--color-success)"
        className="h-2"
      />
      <span className="flex justify-between gap-2 text-xs text-ink-muted tabular-nums">
        <span>{C.progress(percent)}</span>
        {pagos > 0 ? <span>{C.pagosCount(pagos)}</span> : null}
      </span>
    </div>
  );
}

/** Tarjeta principal del detalle: estado de pago bien grande + avance + desglose. */
export function PaymentStatusCard({ inscripcion }: Props) {
  const pagada = inscripcion.saldoPendiente <= 0;
  return (
    <section
      aria-label={C.ESTADO_PAGO}
      className="grid overflow-hidden rounded-xl border border-border bg-surface shadow-xs lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]"
    >
      <div
        className={cn(
          'flex flex-col justify-center gap-5 p-5 md:p-6',
          pagada && 'bg-success-soft',
        )}
      >
        <Headline inscripcion={inscripcion} />
        <Progress inscripcion={inscripcion} />
      </div>
      <PaymentBreakdown inscripcion={inscripcion} />
    </section>
  );
}
