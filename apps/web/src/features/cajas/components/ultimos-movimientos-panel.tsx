import { AppDataGrid } from '@/shared/components/data';
import { EmptyState } from '@/shared/components/feedback';
import { Panel } from '@/shared/components/ui/panel';
import type { Movimiento } from '@/shared/domain';
import { CAJAS_COPY as C } from '@/features/cajas/constants/copy';
import { ULTIMOS_COLUMNS } from '@/features/cajas/components/movimiento-columns';
import { MovimientoMobileRow } from '@/features/cajas/components/movimiento-mobile-row';

/** "Últimos Movimientos" de la caja de grupo (sin paginación). */
export function UltimosMovimientosPanel({
  movimientos,
}: {
  readonly movimientos: readonly Movimiento[];
}) {
  return (
    <Panel title={C.ULTIMOS_MOVIMIENTOS} flush>
      <AppDataGrid
        columns={ULTIMOS_COLUMNS}
        data={movimientos}
        pagination="none"
        getRowId={(row) => row.id}
        ariaLabel={C.ULTIMOS_MOVIMIENTOS}
        emptyState={<EmptyState title={C.NO_MOVIMIENTOS} />}
        mobileRow={(row) => <MovimientoMobileRow movimiento={row} />}
      />
    </Panel>
  );
}
