import { Pencil } from 'lucide-react';

import { DirectionTile, Money } from '@/shared/components/data';
import { Button } from '@/shared/components/ui/button';
import {
  CONCEPTO_MOVIMIENTO_LABELS,
  MEDIO_PAGO_LABELS,
  TIPO_MOVIMIENTO,
  type MovimientoInscripcion,
} from '@/shared/domain';
import { formatMoney } from '@/shared/format';
import { DATE_FORMATS, formatDate } from '@/shared/time';
import { DETAIL_COPY as C } from '@/features/inscripciones/constants/copy';
import { isPagoEditable } from '@/features/inscripciones/helpers/detail';

interface PagoItemProps {
  readonly movimiento: MovimientoInscripcion;
  readonly onEdit: (movimiento: MovimientoInscripcion) => void;
}

/** Ítem del historial: monto (− si egreso), fecha `d MMM`, concepto y medio; editar solo pagos reales. */
export function PagoItem({ movimiento, onEdit }: PagoItemProps) {
  const egreso = movimiento.tipo === TIPO_MOVIMIENTO.EGRESO;
  return (
    <li className="flex min-h-14 items-center gap-3 px-4 py-2.5 md:px-[18px]">
      <DirectionTile direction={egreso ? 'out' : 'in'} />
      <div className="min-w-0 flex-1">
        <p className="flex items-baseline justify-between gap-3">
          <Money
            amount={movimiento.monto}
            sign={egreso ? 'out' : 'in'}
            className="text-sm font-medium"
          />
          <span className="text-xs text-ink-subtle">
            {formatDate(movimiento.fecha, DATE_FORMATS.dayMonth)}
          </span>
        </p>
        <p className="truncate text-xs text-ink-subtle">
          {`${CONCEPTO_MOVIMIENTO_LABELS[movimiento.concepto]} · ${MEDIO_PAGO_LABELS[movimiento.medioPago]}`}
        </p>
      </div>
      {isPagoEditable(movimiento) ? (
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={C.editPagoLabel(formatMoney(movimiento.monto))}
          onClick={() => onEdit(movimiento)}
        >
          <Pencil aria-hidden />
        </Button>
      ) : (
        <span aria-hidden className="size-10 shrink-0 md:size-8" />
      )}
    </li>
  );
}
