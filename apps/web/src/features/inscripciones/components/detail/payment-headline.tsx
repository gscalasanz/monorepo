import { CircleCheck } from 'lucide-react';

import { Money } from '@/shared/components/data';
import type { Inscripcion } from '@/shared/domain';
import { formatMoney } from '@/shared/format';
import { DETAIL_COPY as C } from '@/features/inscripciones/constants/copy';
import { montoAPagar } from '@/features/inscripciones/helpers/detail';

/** "Saldo pendiente $X" o "Estado de pago: Al día" + "$p pagado de $t". */
export function PaymentHeadline({
  inscripcion,
}: {
  readonly inscripcion: Inscripcion;
}) {
  const pendiente = inscripcion.saldoPendiente > 0;
  return (
    <div className="grid gap-1">
      <span className="text-[13px] text-ink-muted">
        {pendiente ? C.SALDO_PENDIENTE : C.ESTADO_PAGO}
      </span>
      {pendiente ? (
        <Money amount={inscripcion.saldoPendiente} tone="debt" size="figure" />
      ) : (
        <span className="flex items-center gap-2 text-[28px] leading-9 font-semibold text-success">
          <CircleCheck aria-hidden className="size-6" />
          {C.AL_DIA}
        </span>
      )}
      <span className="text-sm text-ink-muted">
        {C.pagadoDe(
          formatMoney(inscripcion.montoPagado),
          formatMoney(montoAPagar(inscripcion)),
        )}
      </span>
    </div>
  );
}
