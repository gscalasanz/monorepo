'use client';

import { ReceiptText } from 'lucide-react';

import { EmptyState } from '@/shared/components/feedback';
import {
  MovimientoCard,
  MovimientoFilterTabs,
} from '@/shared/components/finanzas';
import type { MovimientoCampamento } from '@/shared/domain';
import { MOVIMIENTOS_COPY as C } from '@/features/campamentos/constants/copy';
import type { DetalleActions } from '@/features/campamentos/hooks/use-detalle-actions';
import type { CampamentoDetalleState } from '@/features/campamentos/hooks/use-campamento-detalle';

export interface MovimientosTabProps {
  readonly state: CampamentoDetalleState;
  readonly movimientos: readonly MovimientoCampamento[];
  readonly actions: DetalleActions;
}

/** Tab "Movimientos": filtro en el servidor (Todos/Ingresos/Egresos/Gastos) + cards. */
export function MovimientosTab({
  state,
  movimientos,
  actions,
}: MovimientosTabProps) {
  return (
    <div className="flex flex-col gap-3">
      <MovimientoFilterTabs
        value={state.filtro}
        onValueChange={state.setFiltro}
      />
      {movimientos.length === 0 ? (
        <EmptyState icon={ReceiptText} title={C.EMPTY} hint={C.EMPTY_HINT} />
      ) : (
        <div className="flex flex-col gap-2">
          {movimientos.map((m) => (
            <MovimientoCard
              key={m.id}
              movimiento={m}
              onPagarReembolso={(mov) => void actions.pagarReembolso(mov)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
