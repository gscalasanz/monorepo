'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

import { ErrorState } from '@/shared/components/feedback';
import { MOVIMIENTOS_COPY as C } from '@/features/movimientos/constants/copy';
import {
  listStateFromParams,
  type MovimientosListState,
} from '@/features/movimientos/helpers/list-params';
import { useMovimientosList } from '@/features/movimientos/hooks/use-movimientos-list';
import { MovimientosGrid } from '@/features/movimientos/components/movimientos-grid';
import { MovimientosListHeader } from '@/features/movimientos/components/movimientos-list-header';
import { MovimientosToolbar } from '@/features/movimientos/components/movimientos-toolbar';

/** `/movimientos` (y `/movimientos/:id`, paridad): lee los query params iniciales. */
export function MovimientosListView() {
  const searchParams = useSearchParams();
  const initial = useMemo(
    () => listStateFromParams(searchParams),
    [searchParams],
  );
  // Si cambian los query params (otra navegación), se reinicia el estado.
  return <MovimientosList key={searchParams.toString()} initial={initial} />;
}

function MovimientosList({
  initial,
}: {
  readonly initial: MovimientosListState;
}) {
  const list = useMovimientosList(initial);
  const { remove } = list;
  const onDelete = useCallback((id: string) => void remove(id), [remove]);
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <MovimientosListHeader total={list.total} />
      <section className="flex min-w-0 flex-col rounded-xl border border-border bg-surface shadow-xs">
        <MovimientosToolbar
          tab={list.state.tab}
          onTabChange={list.setTab}
          filters={list.state.filters}
          onFiltersChange={list.setFilters}
        />
        {list.error ? (
          <ErrorState
            message={list.error}
            onRetry={() => void list.reload()}
            retryLabel={C.RETRY}
            className="p-6"
          />
        ) : (
          <MovimientosGrid
            rows={list.rows}
            total={list.total}
            isLoading={list.isLoading}
            state={list.state}
            onPageChange={list.setPage}
            onDelete={onDelete}
          />
        )}
      </section>
    </div>
  );
}
