'use client';

import { CircleMinus, ReceiptText } from 'lucide-react';

import { ListPanel, ListToolbar } from '@/shared/components/data';
import { EmptyState } from '@/shared/components/feedback';
import {
  MovimientoFilterTabs,
  MovimientosTable,
} from '@/shared/components/finanzas';
import { Button } from '@/shared/components/ui/button';
import type { MovimientoCampamento } from '@/shared/domain';
import { MOVIMIENTOS_COPY as C } from '@/features/campamentos/constants/copy';
import type { DetalleActions } from '@/features/campamentos/hooks/use-detalle-actions';
import type { CampamentoDetalleState } from '@/features/campamentos/hooks/use-campamento-detalle';

export interface MovimientosTabProps {
  readonly state: CampamentoDetalleState;
  readonly movimientos: readonly MovimientoCampamento[];
  readonly actions: DetalleActions;
  readonly onGasto: () => void;
}

/** Tab "Movimientos" (como eventos): filtro en el servidor, "Registrar gasto" y la tabla compartida. */
export function MovimientosTab({
  state,
  movimientos,
  actions,
  onGasto,
}: MovimientosTabProps) {
  return (
    <ListPanel
      toolbar={
        <ListToolbar>
          <MovimientoFilterTabs
            value={state.filtro}
            onValueChange={state.setFiltro}
          />
          <Button
            variant="secondary"
            icon={<CircleMinus aria-hidden />}
            onClick={onGasto}
            className="md:ml-auto"
          >
            {C.REGISTRAR_GASTO}
          </Button>
        </ListToolbar>
      }
    >
      {movimientos.length === 0 ? (
        <EmptyState icon={ReceiptText} title={C.EMPTY} hint={C.EMPTY_HINT} />
      ) : (
        <MovimientosTable
          movimientos={movimientos}
          ariaLabel={C.TABLE_LABEL}
          onPagarReembolso={(m) => void actions.pagarReembolso(m)}
        />
      )}
    </ListPanel>
  );
}
