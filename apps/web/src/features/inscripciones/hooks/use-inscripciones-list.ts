'use client';

import { useCallback, useMemo, useState } from 'react';

import type { FilterValues } from '@/shared/components/data';
import { confirmDialog } from '@/shared/confirm';
import { useAsyncData } from '@/shared/hooks';
import { LIST_COPY as C } from '@/features/inscripciones/constants/copy';
import {
  filtersKey,
  filtersToQuery,
  fromFilterValues,
  toFilterValues,
  type InscripcionFilters,
} from '@/features/inscripciones/helpers/filters';
import { filterBySearch } from '@/features/inscripciones/helpers/list';
import { useInscripcionesFilters } from '@/features/inscripciones/hooks/use-inscripciones-filters';
import {
  deleteInscripcion,
  fetchConsolidado,
  fetchInscripciones,
} from '@/features/inscripciones/services/inscripciones-api';

/** Inscripciones + consolidado para los filtros dados; eliminar recarga ambos. */
function useInscripcionesData(filters: InscripcionFilters) {
  const key = filtersKey(filters);
  const query = filtersToQuery(filters);
  const list = useAsyncData({
    key: `inscripciones:${key}`,
    load: (signal) => fetchInscripciones({ query, signal }),
  });
  const consolidado = useAsyncData({
    key: `inscripciones-consolidado:${key}`,
    load: (signal) => fetchConsolidado({ query, signal }),
  });
  const { reload: reloadList } = list;
  const { reload: reloadConsolidado } = consolidado;
  const remove = useCallback(
    async (id: string) => {
      const result = await confirmDialog.runDelete(C.ENTITY, {
        action: () => deleteInscripcion(id),
      });
      if (result.confirmed && !result.error)
        await Promise.all([reloadList(), reloadConsolidado()]);
    },
    [reloadList, reloadConsolidado],
  );
  return { list, consolidado: consolidado.data, remove };
}

/** Lista de inscripciones: filtros en la URL, búsqueda local y eliminación con confirmación. */
export function useInscripcionesList() {
  const { filters, setFilters, setTipo, currentYear } =
    useInscripcionesFilters();
  const [search, setSearch] = useState('');
  const { list, consolidado, remove } = useInscripcionesData(filters);
  const rows = useMemo(
    () => filterBySearch(list.data ?? [], search),
    [list.data, search],
  );
  const filterValues = useMemo(
    () => toFilterValues(filters, search),
    [filters, search],
  );

  const onFiltersChange = (values: FilterValues) => {
    const next = fromFilterValues(values, { tipo: filters.tipo, currentYear });
    setSearch(next.search);
    if (filtersKey(next.filters) !== filtersKey(filters))
      setFilters(next.filters);
  };

  return {
    filters,
    filterValues,
    onFiltersChange,
    setTipo,
    currentYear,
    rows,
    isLoading: list.isLoading,
    error: list.error,
    reload: list.reload,
    consolidado,
    remove,
  };
}
