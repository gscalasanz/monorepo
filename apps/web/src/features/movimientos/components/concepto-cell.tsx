import { Paperclip } from 'lucide-react';

import { DirectionTile } from '@/shared/components/data';
import type { Movimiento } from '@/shared/domain';
import { MOVIMIENTOS_COPY as C } from '@/features/movimientos/constants/copy';
import {
  conceptoLabel,
  isIngreso,
} from '@/features/movimientos/helpers/view-model';

/** Concepto con tile de dirección y la descripción como sub-línea. */
export function ConceptoCell({ movimiento }: { readonly movimiento: Movimiento }) {
  return (
    <span className="flex min-w-0 items-center gap-2.5">
      <DirectionTile direction={isIngreso(movimiento) ? 'in' : 'out'} />
      <span className="min-w-0">
        <span className="block truncate font-medium text-ink">
          {conceptoLabel(movimiento)}
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
          aria-label={C.COMPROBANTE_ICON}
          className="size-3.5 shrink-0 text-ink-subtle"
        />
      ) : null}
    </span>
  );
}
