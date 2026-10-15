'use client';

import { useMemo, useState } from 'react';

import type { FilterValues } from '@/shared/components/data';
import type { Persona } from '@/shared/domain';
import { useAsyncData } from '@/shared/hooks';
import { SEARCH_FILTER_KEY } from '@/features/personas/constants/personas';
import {
  buildStats,
  docKeysForTab,
  filterPersonas,
  splitByTipo,
} from '@/features/personas/helpers/list';
import { usePersonasTab } from '@/features/personas/hooks/use-personas-tab';
import { fetchPersonas } from '@/features/personas/services/personas-api';

const PERSONAS_KEY = 'personas';

function searchOf(filters: FilterValues): string {
  const value = filters[SEARCH_FILTER_KEY];
  return typeof value === 'string' ? value : '';
}

/** Estado del listado: carga, tab (en la URL), filtros y datos derivados (stats, filas, columnas). */
export function usePersonasList() {
  const { data, error, isLoading, setData } = useAsyncData<readonly Persona[]>({
    key: PERSONAS_KEY,
    load: fetchPersonas,
  });
  const { tab, setTab } = usePersonasTab();
  const [filters, setFilters] = useState<FilterValues>({});
  const [showDisabled, setShowDisabled] = useState(false);

  const derived = useMemo(() => {
    const groups = splitByTipo(data ?? []);
    const filter = { tab, search: searchOf(filters), showDisabled };
    return {
      stats: buildStats({ groups, showDisabled }),
      rows: filterPersonas({ groups, filter }),
      docKeys: docKeysForTab(tab),
    };
  }, [data, tab, filters, showDisabled]);

  return {
    ...derived,
    isLoading: isLoading && !data,
    error: data ? null : error,
    tab,
    setTab,
    filters,
    setFilters,
    showDisabled,
    setShowDisabled,
    setData,
  };
}
