'use client';

import { Landmark } from 'lucide-react';
import { useState } from 'react';

import { StatCard } from '@/shared/components/charts';
import { ErrorState, LoadingState } from '@/shared/components/feedback';
import { CAJAS_COPY as C } from '@/features/cajas/constants/copy';
import { CajaDrawer } from '@/features/cajas/components/caja-drawer';
import { CajaGrupoActions } from '@/features/cajas/components/caja-grupo-actions';
import { UltimosMovimientosPanel } from '@/features/cajas/components/ultimos-movimientos-panel';
import { TransferenciaDialog } from '@/features/cajas/components/transferencia-dialog';
import { useCajaGrupo } from '@/features/cajas/hooks/use-caja-grupo';

/**
 * Tab "Caja de Grupo": saldo, acciones, últimos 10 movimientos y el drawer
 * "Ver Detalles". El drawer lee la caja de estos mismos datos, así un
 * movimiento rápido refresca su saldo, la StatCard y los últimos a la vez.
 */
export function CajaGrupoTab() {
  const { caja, ultimos, isLoading, error, reload } = useCajaGrupo();
  const [transferOpen, setTransferOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (isLoading) return <LoadingState label={C.LOADING} />;
  if (!caja)
    return (
      <ErrorState
        message={error ?? C.GRUPO_LOAD_ERROR}
        onRetry={() => void reload()}
      />
    );

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <StatCard
          icon={Landmark}
          title={C.SALDO_GRUPO}
          value={caja.saldoActual}
          format="currency"
          variant={caja.saldoActual >= 0 ? 'success' : 'danger'}
          className="lg:min-w-72"
        />
        <CajaGrupoActions
          cajaId={caja.id}
          onTransferir={() => setTransferOpen(true)}
          onVerDetalles={() => setDrawerOpen(true)}
        />
      </section>
      <UltimosMovimientosPanel movimientos={ultimos} />
      <TransferenciaDialog
        open={transferOpen}
        onOpenChange={setTransferOpen}
        origen={{ id: caja.id, saldo: caja.saldoActual }}
        onSuccess={() => void reload()}
      />
      <CajaDrawer
        caja={drawerOpen ? caja : null}
        onClose={() => setDrawerOpen(false)}
        onChanged={() => void reload()}
      />
    </div>
  );
}
