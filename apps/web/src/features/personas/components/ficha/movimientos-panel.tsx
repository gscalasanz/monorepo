import { ArrowLeftRight } from 'lucide-react';

import { EmptyState } from '@/shared/components/feedback';
import { Panel } from '@/shared/components/ui/panel';
import { FICHA_COPY as C } from '@/features/personas/constants/copy';
import { groupMovimientosByMonth } from '@/features/personas/helpers/ficha';
import type { MovimientoDashboard } from '@/features/personas/models/dashboard-schema';
import { MovimientoGroup } from '@/features/personas/components/ficha/movimiento-group';

/** Actividad de la persona (pagos, uso de saldo, ganancias), agrupada por mes. */
export function MovimientosPanel({
  movimientos,
}: {
  readonly movimientos: readonly MovimientoDashboard[];
}) {
  const groups = groupMovimientosByMonth(movimientos);
  return (
    <Panel title={C.MOVIMIENTOS} flush>
      {groups.length === 0 ? (
        <EmptyState
          icon={ArrowLeftRight}
          title={C.NO_MOVIMIENTOS}
          hint={C.NO_MOVIMIENTOS_HINT}
        />
      ) : (
        <div className="flex flex-col py-2">
          {groups.map((group, index) => (
            <MovimientoGroup key={`${group.key}-${index}`} group={group} />
          ))}
        </div>
      )}
    </Panel>
  );
}
