'use client';

import { useMemo, useState } from 'react';

import type { FilterValues } from '@/shared/components/data';
import { CAJAS_RAMA_EDUCADORES, RAMAS, type CajasQuery } from '@/shared/domain';
import { useAsyncData } from '@/shared/hooks';
import { searchCuentas, toCuentaRows } from '@/features/cajas/helpers/cuentas';
import { fetchCuentasPersonales } from '@/features/cajas/services/cajas-api';

const KEY_PREFIX = 'cajas:personales:';

type RamaFilter = NonNullable<CajasQuery['rama']>;

function toRamaFilter(value: FilterValues[string]): RamaFilter | undefined {
  if (typeof value !== 'string') return undefined;
  if (value === CAJAS_RAMA_EDUCADORES) return CAJAS_RAMA_EDUCADORES;
  return RAMAS.find((rama) => rama === value);
}

/** Cuentas personales: la rama re-consulta al backend, la búsqueda filtra en cliente. */
export function useCuentasPersonales() {
  const [filters, setFilters] = useState<FilterValues>({});
  const rama = toRamaFilter(filters.rama);
  const search = typeof filters.search === 'string' ? filters.search : '';

  const { data, isLoading, error } = useAsyncData({
    key: `${KEY_PREFIX}${rama ?? ''}`,
    load: (signal) => fetchCuentasPersonales(rama, signal),
  });

  const rows = useMemo(
    () => searchCuentas(toCuentaRows(data ?? []), search),
    [data, search],
  );

  return {
    rows,
    isLoading,
    error,
    hasData: data !== undefined,
    filters,
    setFilters,
  };
}
