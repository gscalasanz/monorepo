import { CircleMinus, HandHeart } from 'lucide-react';

import { KeyValueList, Money } from '@/shared/components/data';
import { Button } from '@/shared/components/ui/button';
import type { Inscripcion } from '@/shared/domain';
import { DETAIL_COPY as C } from '@/features/inscripciones/constants/copy';
import { montoAPagar } from '@/features/inscripciones/helpers/detail';
import { PaymentHeadline } from '@/features/inscripciones/components/detail/payment-headline';
import { PaymentProgress } from '@/features/inscripciones/components/detail/payment-progress';

interface PaymentCardProps {
  readonly inscripcion: Inscripcion;
  readonly onBonificar: () => void;
  readonly onQuitarBonificacion: () => void;
}

function breakdownOf(inscripcion: Inscripcion) {
  const bonificacion =
    inscripcion.montoBonificado > 0
      ? [
          {
            label: C.BONIFICACION,
            value: <Money amount={inscripcion.montoBonificado} sign="out" />,
          },
        ]
      : [];
  return [
    { label: C.INSCRIPCION, value: <Money amount={inscripcion.montoTotal} /> },
    ...bonificacion,
    { label: C.TOTAL, value: <Money amount={montoAPagar(inscripcion)} /> },
    {
      label: C.PAGADO_LABEL,
      value: (
        <Money amount={inscripcion.montoPagado} className="text-money-in" />
      ),
    },
  ];
}

/** Card de pago: saldo pendiente, avance, desglose y bonificación. */
export function PaymentCard({
  inscripcion,
  onBonificar,
  onQuitarBonificacion,
}: PaymentCardProps) {
  const bonificado = inscripcion.montoBonificado > 0;
  const breakdown = breakdownOf(inscripcion);
  return (
    <section className="grid gap-4 rounded-xl border border-border bg-surface p-4 shadow-xs md:p-[18px]">
      <PaymentHeadline inscripcion={inscripcion} />
      <PaymentProgress inscripcion={inscripcion} />
      <KeyValueList
        items={breakdown}
        columns={breakdown.length === 4 ? 4 : 3}
      />
      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          size="sm"
          icon={<HandHeart aria-hidden />}
          onClick={onBonificar}
        >
          {bonificado ? C.AJUSTAR_BONIFICACION : C.BONIFICAR}
        </Button>
        {bonificado ? (
          <Button
            variant="ghost"
            size="sm"
            icon={<CircleMinus aria-hidden />}
            onClick={onQuitarBonificacion}
          >
            {C.QUITAR_BONIFICACION}
          </Button>
        ) : null}
      </div>
    </section>
  );
}
