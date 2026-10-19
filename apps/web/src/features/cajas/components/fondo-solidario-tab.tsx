'use client';

import { useCallback, useState } from 'react';

import { ErrorState, LoadingState } from '@/shared/components/feedback';
import { CAJAS_COPY as C } from '@/features/cajas/constants/copy';
import { FondoSolidarioSummary } from '@/features/cajas/components/fondo-solidario-summary';
import { TransferenciaDialog } from '@/features/cajas/components/transferencia-dialog';
import { TransferenciasPanel } from '@/features/cajas/components/transferencias-panel';
import type { TransferenciaRow } from '@/features/cajas/helpers/fondo-solidario';
import { useFondoSolidario } from '@/features/cajas/hooks/use-fondo-solidario';

/** Tab "Fondo Solidario": saldo, bonificado, creación/financiamiento y transferencias recibidas. */
export function FondoSolidarioTab() {
  const fs = useFondoSolidario();
  const [transferOpen, setTransferOpen] = useState(false);
  const { eliminarTransferencia, view } = fs;
  const onDelete = useCallback(
    (row: TransferenciaRow) => void eliminarTransferencia(row.id),
    [eliminarTransferencia],
  );

  if (fs.isLoading) return <LoadingState label={C.LOADING} />;
  if (!view)
    return (
      <ErrorState
        message={fs.error ?? C.FS_LOAD_ERROR}
        onRetry={() => void fs.reload()}
      />
    );

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <FondoSolidarioSummary
        view={view}
        creating={fs.creating}
        onCrear={() => void fs.crear()}
        onTransferir={() => setTransferOpen(true)}
      />
      {view.cajaId && (
        <TransferenciasPanel rows={view.transferencias} onDelete={onDelete} />
      )}
      {view.cajaGrupo && (
        <TransferenciaDialog
          open={transferOpen}
          onOpenChange={setTransferOpen}
          origen={view.cajaGrupo}
          onSuccess={() => void fs.reload()}
        />
      )}
    </div>
  );
}
