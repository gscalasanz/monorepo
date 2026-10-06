import { Plus, ReceiptText } from 'lucide-react';

import { EmptyState } from '@/shared/components/feedback';
import { Button } from '@/shared/components/ui/button';
import type { Movimiento } from '@/shared/domain';
import { CAJAS_COPY as C } from '@/features/cajas/constants/copy';
import { DrawerMovimientoItem } from '@/features/cajas/components/drawer-movimiento-item';
import {
  drawerEmptyMessage,
  type DrawerFilter,
} from '@/features/cajas/helpers/movimientos';

export interface DrawerMovimientosListProps {
  readonly movimientos: readonly Movimiento[];
  readonly filter: DrawerFilter;
  readonly onRegistrar: () => void;
}

/** Lista del drawer; vacía muestra el mensaje según el filtro y el CTA de registro. */
export function DrawerMovimientosList({
  movimientos,
  filter,
  onRegistrar,
}: DrawerMovimientosListProps) {
  if (movimientos.length === 0) {
    return (
      <EmptyState
        icon={ReceiptText}
        title={C.SIN_MOVIMIENTOS}
        hint={drawerEmptyMessage(filter)}
        action={
          <Button
            variant="secondary"
            size="sm"
            icon={<Plus aria-hidden />}
            onClick={onRegistrar}
          >
            {C.REGISTRAR_PRIMERO}
          </Button>
        }
      />
    );
  }
  return (
    <ul className="divide-y divide-border">
      {movimientos.map((mov) => (
        <DrawerMovimientoItem key={mov.id} movimiento={mov} />
      ))}
    </ul>
  );
}
