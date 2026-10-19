'use client';

import { useCallback, useState } from 'react';

import type { FilterValues, PageChange } from '@/shared/components/data';
import { confirmDialog } from '@/shared/confirm';
import { useAsyncData } from '@/shared/hooks';
import { notify } from '@/shared/notifications';
import { MOVIMIENTOS_COPY as C } from '@/features/movimientos/constants/copy';
import type { TipoTab } from '@/features/movimientos/constants/movimientos';
import {
  listQuery,
  listQueryKey,
  type MovimientosListState,
} from '@/features/movimientos/helpers/list-params';
import {
  deleteMovimiento,
  fetchMovimientosPage,
} from '@/features/movimientos/services/movimientos-api';

/**
 * Lista paginada en el servidor (port de `MovimientosStateService`): cambiar
 * tab o filtros vuelve a la página 1; el tamaño de página se conserva.
 */
export function useMovimientosList(initial: MovimientosListState) {
  const [state, setState] = useState<MovimientosListState>(initial);
  const { data, error, isLoading, reload } = useAsyncData({
    key: listQueryKey(state),
    load: (signal) => fetchMovimientosPage({ query: listQuery(state), signal }),
  });

  const setTab = useCallback((tab: TipoTab) => {
    setState((prev) => ({ ...prev, tab, pageIndex: 0 }));
  }, []);

  const setFilters = useCallback((filters: FilterValues) => {
    setState((prev) => ({ ...prev, filters, pageIndex: 0 }));
  }, []);

  const setPage = useCallback((next: PageChange) => {
    setState((prev) => ({
      ...prev,
      pageIndex: next.pageSize === prev.pageSize ? next.pageIndex : 0,
      pageSize: next.pageSize,
    }));
  }, []);

  const remove = useCallback(
    async (id: string): Promise<void> => {
      const result = await confirmDialog.runDelete(C.ENTITY, {
        action: () => deleteMovimiento(id),
      });
      if (!result.confirmed) return;
      notify.success(C.DELETED);
      await reload();
    },
    [reload],
  );

  return {
    state,
    rows: data?.data ?? [],
    total: data?.meta.total ?? 0,
    isLoading,
    error: isLoading ? null : error,
    reload,
    setTab,
    setFilters,
    setPage,
    remove,
  };
}
