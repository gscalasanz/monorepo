'use client';

import { useMemo } from 'react';

import { AppDataGrid, type PageChange } from '@/shared/components/data';
import { EmptyState } from '@/shared/components/feedback';
import type { Movimiento } from '@/shared/domain';
import { MOVIMIENTOS_COPY as C } from '@/features/movimientos/constants/copy';
import { TIPO_TAB } from '@/features/movimientos/constants/movimientos';
import type { MovimientosListState } from '@/features/movimientos/helpers/list-params';
import { emptyHint } from '@/features/movimientos/helpers/view-model';
import { movimientoColumns } from '@/features/movimientos/components/movimiento-columns';
import { MovimientoMobileRow } from '@/features/movimientos/components/movimiento-mobile-row';

interface MovimientosGridProps {
  readonly rows: readonly Movimiento[];
  readonly total: number;
  readonly isLoading: boolean;
  readonly state: MovimientosListState;
  readonly onPageChange: (next: PageChange) => void;
  readonly onDelete: (id: string) => void;
}

const rowId = (m: Movimiento): string => m.id;

/** Tabla densa paginada en el servidor (lista en mobile). */
export function MovimientosGrid({
  rows,
  total,
  isLoading,
  state,
  onPageChange,
  onDelete,
}: MovimientosGridProps) {
  const showTipo = state.tab === TIPO_TAB.TODOS;
  const columns = useMemo(
    () => movimientoColumns({ showTipo, onDelete }),
    [showTipo, onDelete],
  );
  return (
    <AppDataGrid
      columns={columns}
      data={rows}
      isLoading={isLoading}
      getRowId={rowId}
      ariaLabel={C.TABLE_LABEL}
      emptyState={
        <EmptyState title={C.EMPTY_TITLE} hint={emptyHint(state.tab)} />
      }
      mobileRow={(m) => (
        <MovimientoMobileRow movimiento={m} onDelete={onDelete} />
      )}
      pagination={{
        pageIndex: state.pageIndex,
        pageSize: state.pageSize,
        total,
        onChange: onPageChange,
      }}
    />
  );
}
