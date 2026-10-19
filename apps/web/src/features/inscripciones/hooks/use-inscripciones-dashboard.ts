'use client';

import { useMemo } from 'react';

import type { FilterValues } from '@/shared/components/data';
import { useAsyncData } from '@/shared/hooks';
import {
  filtersKey,
  filtersToQuery,
  fromFilterValues,
  toFilterValues,
} from '@/features/inscripciones/helpers/filters';
import { useInscripcionesFilters } from '@/features/inscripciones/hooks/use-inscripciones-filters';
import { fetchConsolidado } from '@/features/inscripciones/services/inscripciones-api';

/** Dashboard de inscripciones: consolidado según tab + filtros (en la URL). */
export function useInscripcionesDashboard() {
  const { filters, setFilters, setTipo, currentYear } =
    useInscripcionesFilters();
  const key = filtersKey(filters);
  const query = filtersToQuery(filters);
  const consolidado = useAsyncData({
    key: `inscripciones-dashboard:${key}`,
    load: (signal) => fetchConsolidado({ query, signal }),
  });
  const filterValues = useMemo(() => toFilterValues(filters), [filters]);

  const onFiltersChange = (values: FilterValues) => {
    const next = fromFilterValues(values, { tipo: filters.tipo, currentYear });
    if (filtersKey(next.filters) !== key) setFilters(next.filters);
  };

  return {
    filters,
    filterValues,
    onFiltersChange,
    setTipo,
    currentYear,
    consolidado: consolidado.data,
    isLoading: consolidado.isLoading,
    error: consolidado.error,
    reload: consolidado.reload,
  };
}
