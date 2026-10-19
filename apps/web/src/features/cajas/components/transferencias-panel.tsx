'use client';

import { useMemo } from 'react';

import { AppDataGrid } from '@/shared/components/data';
import { EmptyState } from '@/shared/components/feedback';
import { Panel } from '@/shared/components/ui/panel';
import { CAJAS_COPY as C } from '@/features/cajas/constants/copy';
import { TransferenciaMobileRow } from '@/features/cajas/components/transferencia-mobile-row';
import { transferenciasColumns } from '@/features/cajas/components/transferencias-columns';
import type { TransferenciaRow } from '@/features/cajas/helpers/fondo-solidario';

export interface TransferenciasPanelProps {
  readonly rows: readonly TransferenciaRow[];
  /** Debe ser estable (`useCallback`): define las columnas. */
  readonly onDelete: (row: TransferenciaRow) => void;
}

/** "Transferencias Recibidas" del fondo solidario, con borrado por fila. */
export function TransferenciasPanel({
  rows,
  onDelete,
}: TransferenciasPanelProps) {
  const columns = useMemo(() => transferenciasColumns(onDelete), [onDelete]);
  return (
    <Panel title={C.TRANSFERENCIAS_RECIBIDAS} flush>
      <AppDataGrid
        columns={columns}
        data={rows}
        pagination="none"
        getRowId={(row) => row.id}
        ariaLabel={C.TRANSFERENCIAS_RECIBIDAS}
        emptyState={<EmptyState title={C.NO_MOVIMIENTOS} />}
        mobileRow={(row) => (
          <TransferenciaMobileRow row={row} onDelete={onDelete} />
        )}
      />
    </Panel>
  );
}
