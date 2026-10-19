'use client';

import { useCallback, useMemo, useState } from 'react';

import type { FilterValues } from '@/shared/components/data';
import { FILTRO_MOVIMIENTOS, type FiltroMovimientos } from '@/shared/domain';
import { useAsyncData } from '@/shared/hooks';
import {
  applyClientFilter,
  buildDetalleQuery,
  hasParticipantesFilter,
  nextParticipantesFilter,
  type ParticipantesFilter,
} from '@/features/campamentos/helpers/detalle-query';
import { fetchCampamentoDetalle } from '@/features/campamentos/services/campamentos-api';

/**
 * Detalle consolidado con filtros: movimientos (servidor) y participantes
 * (nombre/rama, auto-apply con debounce de la barra). Cada cambio recarga;
 * los datos previos siguen visibles mientras tanto ("refreshing"). Tras una
 * acción se recarga con los filtros vigentes.
 */
export function useCampamentoDetalle(id: string) {
  const [filtro, setFiltro] = useState<FiltroMovimientos>(
    FILTRO_MOVIMIENTOS.TODOS,
  );
  const [filterValues, setFilterValues] = useState<FilterValues>({});
  const [filter, setFilter] = useState<ParticipantesFilter>({});
  const query = useMemo(
    () => buildDetalleQuery({ id, filtro, filter }),
    [id, filtro, filter],
  );
  const load = useCallback(
    (signal: AbortSignal) => fetchCampamentoDetalle(query, signal),
    [query],
  );
  const detalle = useAsyncData({ key: JSON.stringify(query), load });
  const { data } = detalle;

  const onFilterChange = useCallback((values: FilterValues) => {
    setFilterValues(values);
    setFilter((current) => nextParticipantesFilter(current, values));
  }, []);

  const participantes = useMemo(
    () => (data ? applyClientFilter(data.participantes, filter) : []),
    [data, filter],
  );

  return {
    detalle: data,
    participantes,
    error: detalle.error,
    initialLoading: detalle.isLoading && data === undefined,
    refreshing: detalle.isLoading && data !== undefined,
    reload: detalle.reload,
    filtro,
    setFiltro,
    filterValues,
    onFilterChange,
    hasFilter: hasParticipantesFilter(filter),
  };
}

export type CampamentoDetalleState = ReturnType<typeof useCampamentoDetalle>;
