import { Paperclip } from 'lucide-react';

import { DirectionTile } from '@/shared/components/data';
import {
  CONCEPTO_MOVIMIENTO_LABELS,
  TIPO_MOVIMIENTO,
  type Movimiento,
} from '@/shared/domain';
import { FINANZAS_COPY } from '@/shared/components/finanzas/copy';

export type MovimientoConceptoData = Pick<
  Movimiento,
  'tipo' | 'concepto' | 'descripcion' | 'comprobanteEntregado'
>;

/**
 * Concepto de un movimiento para tablas: tile de dirección, nombre y la descripción como
 * sub-línea (reemplaza las columnas «Tipo» y «Descripción»); clip si el comprobante está entregado.
 */
export function MovimientoConcepto({
  movimiento,
}: {
  readonly movimiento: MovimientoConceptoData;
}) {
  const ingreso = movimiento.tipo === TIPO_MOVIMIENTO.INGRESO;
  return (
    <span className="flex min-w-0 items-center gap-2.5">
      <DirectionTile direction={ingreso ? 'in' : 'out'} />
      <span className="min-w-0">
        <span className="block truncate font-medium text-ink">
          {CONCEPTO_MOVIMIENTO_LABELS[movimiento.concepto] ??
            movimiento.concepto}
        </span>
        {movimiento.descripcion ? (
          <span className="block max-w-72 truncate text-xs text-ink-subtle">
            {movimiento.descripcion}
          </span>
        ) : null}
      </span>
      {movimiento.comprobanteEntregado ? (
        <Paperclip
          role="img"
          aria-label={FINANZAS_COPY.card.comprobanteEntregado}
          className="size-3.5 shrink-0 text-ink-subtle"
        />
      ) : null}
    </span>
  );
}
