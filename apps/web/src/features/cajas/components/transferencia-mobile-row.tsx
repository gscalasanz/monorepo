import { Trash2 } from 'lucide-react';

import { Money } from '@/shared/components/data';
import { Button } from '@/shared/components/ui/button';
import { DATE_FORMATS, formatDate } from '@/shared/time';
import { CAJAS_COPY as C } from '@/features/cajas/constants/copy';
import type { TransferenciaRow } from '@/features/cajas/helpers/fondo-solidario';

const MONEY_DECIMALS = 2;

export interface TransferenciaMobileRowProps {
  readonly row: TransferenciaRow;
  readonly onDelete: (row: TransferenciaRow) => void;
}

/** Fila mobile de una transferencia recibida con su botón Eliminar. */
export function TransferenciaMobileRow({
  row,
  onDelete,
}: TransferenciaMobileRowProps) {
  const detail = [formatDate(row.fecha, DATE_FORMATS.date), row.responsable]
    .filter(Boolean)
    .join(' · ');
  return (
    <div className="flex w-full items-center gap-3">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink">
          {row.descripcion ?? C.EMPTY_CELL}
        </p>
        <p className="truncate text-xs text-ink-subtle">{detail}</p>
      </div>
      <Money
        amount={row.monto}
        decimals={MONEY_DECIMALS}
        className="shrink-0 text-sm"
      />
      <Button
        variant="ghost"
        size="icon"
        className="text-danger hover:text-danger"
        aria-label={C.ELIMINAR_TRANSFERENCIA}
        onClick={() => onDelete(row)}
      >
        <Trash2 aria-hidden />
      </Button>
    </div>
  );
}
