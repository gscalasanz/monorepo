'use client';

import { useState } from 'react';

import { SegmentedTabs } from '@/shared/components/data';
import { ErrorState, LoadingState } from '@/shared/components/feedback';
import type { CajaConSaldo } from '@/shared/domain';
import { CAJAS_COPY as C } from '@/features/cajas/constants/copy';
import { CajaDrawerFooter } from '@/features/cajas/components/caja-drawer-footer';
import { CajaDrawerHeader } from '@/features/cajas/components/caja-drawer-header';
import { DrawerMovimientosList } from '@/features/cajas/components/drawer-movimientos-list';
import { QuickMovimientoDialog } from '@/features/cajas/components/quick-movimiento-dialog';
import { DRAWER_FILTER_OPTIONS } from '@/features/cajas/helpers/movimientos';
import { useCajaDrawer } from '@/features/cajas/hooks/use-caja-drawer';

export interface CajaDrawerBodyProps {
  readonly caja: CajaConSaldo;
  readonly onClose: () => void;
  readonly onChanged: () => void;
}

/** Contenido del drawer: header con saldo, filtro, lista y acciones. */
export function CajaDrawerBody({
  caja,
  onClose,
  onChanged,
}: CajaDrawerBodyProps) {
  const drawer = useCajaDrawer(caja);
  const [quickOpen, setQuickOpen] = useState(false);
  const openQuick = () => setQuickOpen(true);
  const ready = !drawer.isLoading && !drawer.error;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <CajaDrawerHeader caja={caja} onClose={onClose} />
      <div className="border-b border-border px-4 py-3">
        <SegmentedTabs
          semantics="toggle"
          ariaLabel={C.DRAWER_FILTER_LABEL}
          items={DRAWER_FILTER_OPTIONS}
          value={drawer.filter}
          onValueChange={drawer.setFilter}
        />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {drawer.isLoading && <LoadingState label={C.LOADING_MOVIMIENTOS} />}
        {drawer.error && (
          <ErrorState
            message={drawer.error}
            onRetry={() => void drawer.reload()}
          />
        )}
        {ready && (
          <DrawerMovimientosList
            movimientos={drawer.movimientos}
            filter={drawer.filter}
            onRegistrar={openQuick}
          />
        )}
      </div>
      <CajaDrawerFooter cajaId={caja.id} onRegistrar={openQuick} />
      <QuickMovimientoDialog
        open={quickOpen}
        onOpenChange={setQuickOpen}
        caja={caja}
        onSuccess={() => {
          void drawer.reload();
          onChanged();
        }}
      />
    </div>
  );
}
