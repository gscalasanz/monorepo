'use client';

import { useCallback, useMemo, useState } from 'react';

import type { FilterValues } from '@/shared/components/data';
import { useAsyncData } from '@/shared/hooks';
import { FILTER_KEYS } from '@/features/reportes/constants/filters';
import { summarize, toDeudaFilters } from '@/features/reportes/helpers/deudas';
import {
  isInscripcionSelected,
  toggleInscripcion,
  withoutOrigen,
  withoutTipo,
} from '@/features/reportes/helpers/origen';
import type { InscripcionConsolidada } from '@/features/reportes/models/consolidado';
import { fetchDeudas } from '@/features/reportes/services/reportes-api';

/** Filtros + origen elegido en el consolidado + carga del reporte (cada cambio consulta al backend). */
export function useDeudas() {
  const [values, setValuesState] = useState<FilterValues>({});
  const [campamentoId, setCampamentoId] = useState<string | undefined>();
  const filters = useMemo(
    () => toDeudaFilters(values, campamentoId),
    [values, campamentoId],
  );
  const query = useAsyncData({
    key: JSON.stringify(filters),
    load: (signal) => fetchDeudas(filters, signal),
  });
  const deudas = useMemo(() => query.data ?? [], [query.data]);

  /** Cambiar el tipo de deuda a mano descarta el campamento elegido (serían filtros contradictorios). */
  const setValues = useCallback(
    (next: FilterValues) => {
      if (next[FILTER_KEYS.TIPO] !== values[FILTER_KEYS.TIPO]) setCampamentoId(undefined);
      setValuesState(next);
    },
    [values],
  );

  const toggleCampamento = useCallback((id: string) => {
    setCampamentoId((current) => (current === id ? undefined : id));
    setValuesState(withoutTipo);
  }, []);

  const pickInscripcion = useCallback((item: InscripcionConsolidada) => {
    setCampamentoId(undefined);
    setValuesState((prev) => toggleInscripcion(prev, item));
  }, []);

  const clearOrigen = useCallback(() => {
    setCampamentoId(undefined);
    setValuesState(withoutOrigen);
  }, []);

  return {
    values,
    setValues,
    campamentoId,
    toggleCampamento,
    toggleInscripcion: pickInscripcion,
    clearOrigen,
    isInscripcionSelected: (item: InscripcionConsolidada) =>
      isInscripcionSelected(values, item),
    rama: filters.rama,
    deudas,
    summary: useMemo(() => summarize(deudas), [deudas]),
    isLoading: query.isLoading,
    error: query.error,
    reload: query.reload,
  };
}
