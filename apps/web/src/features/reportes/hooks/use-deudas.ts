'use client';

import { useMemo, useState } from 'react';

import type { FilterValues } from '@/shared/components/data';
import { useAsyncData } from '@/shared/hooks';
import { summarize, toDeudaFilters } from '@/features/reportes/helpers/deudas';
import { fetchDeudas } from '@/features/reportes/services/reportes-api';

/** Filtros + carga del reporte de deudas (cada cambio de filtro consulta al backend). */
export function useDeudas() {
  const [values, setValues] = useState<FilterValues>({});
  const filters = useMemo(() => toDeudaFilters(values), [values]);
  const query = useAsyncData({
    key: JSON.stringify(filters),
    load: (signal) => fetchDeudas(filters, signal),
  });
  const deudas = useMemo(() => query.data ?? [], [query.data]);
  return {
    values,
    setValues,
    deudas,
    summary: useMemo(() => summarize(deudas), [deudas]),
    isLoading: query.isLoading,
    error: query.error,
    reload: query.reload,
  };
}
