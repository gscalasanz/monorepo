'use client';

import { Loader2, Trash2 } from 'lucide-react';

import { DirectionTile, Money } from '@/shared/components/data';
import { Button } from '@/shared/components/ui/button';
import { MEDIO_PAGO_LABELS, TIPO_MOVIMIENTO } from '@/shared/domain';
import { DATE_FORMATS, formatDate } from '@/shared/time';

import { FINANZAS_COPY } from './copy';
import { EstadoPagoBadge } from './estado-pago-badge';
import type { MovimientoCardData } from './types';

const C = FINANZAS_COPY.card;

export interface MovimientoCardProps {
  readonly movimiento: MovimientoCardData;
  /** Muestra el botón "Eliminar movimiento". */
  readonly deletable?: boolean;
  /** Borrado en curso: spinner y botón deshabilitado. */
  readonly deleting?: boolean;
  readonly onDelete?: (movimiento: MovimientoCardData) => void;
  /** Si se pasa, el badge "Pendiente de Reembolso" es un botón. */
  readonly onPagarReembolso?: (movimiento: MovimientoCardData) => void;
}

/** Fila de movimiento de campamentos y eventos (port de `app-movimiento-card`). */
export function MovimientoCard(props: MovimientoCardProps) {
  const { movimiento } = props;
  const isIngreso = movimiento.tipo === TIPO_MOVIMIENTO.INGRESO;
  return (
    <article className="flex items-start gap-3 rounded-lg border border-border bg-surface p-3">
      <DirectionTile direction={isIngreso ? 'in' : 'out'} className="mt-0.5" />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:flex-row sm:items-start sm:gap-4">
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-xs text-ink-subtle tabular-nums">
            {formatDate(movimiento.fecha, DATE_FORMATS.dayMonthYear)}
          </span>
          <span className="text-sm font-medium break-words text-ink">
            {movimiento.descripcion ?? C.sinDescripcion}
          </span>
          <span className="truncate text-xs text-ink-muted">
            {movimiento.responsableNombre}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 sm:flex-col sm:items-end">
          <Money
            amount={movimiento.monto}
            sign={isIngreso ? 'in' : 'out'}
            className="text-sm"
          />
          <span className="text-xs text-ink-muted">
            {MEDIO_PAGO_LABELS[movimiento.medioPago] ?? movimiento.medioPago}
          </span>
          <EstadoPagoBadge
            movimiento={movimiento}
            onPagarReembolso={props.onPagarReembolso}
          />
        </div>
      </div>
      {props.deletable && <DeleteButton {...props} />}
    </article>
  );
}

function DeleteButton({
  movimiento,
  deleting = false,
  onDelete,
}: MovimientoCardProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={C.eliminar}
      disabled={deleting}
      aria-busy={deleting || undefined}
      onClick={() => {
        if (!deleting) onDelete?.(movimiento);
      }}
      className="shrink-0 text-ink-muted hover:text-danger"
    >
      {deleting ? (
        <Loader2 aria-hidden className="size-4 animate-spin" />
      ) : (
        <Trash2 aria-hidden className="size-4" />
      )}
    </Button>
  );
}
