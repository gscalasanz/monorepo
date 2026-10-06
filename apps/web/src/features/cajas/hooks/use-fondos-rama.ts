'use client';

import { useMemo, useState } from 'react';

import type { FilterValues } from '@/shared/components/data';
import { useAsyncData } from '@/shared/hooks';
import {
  ALL_RAMAS,
  buildFondosRamaStats,
  movimientosRamasParams,
  toggleRamaChip,
  type RamaChipValue,
} from '@/features/cajas/helpers/fondos-rama';
import {
  fetchFondosRama,
  fetchMovimientosFiltrados,
} from '@/features/cajas/services/cajas-api';

const FONDOS_KEY = 'cajas:fondos-rama';
const MOVIMIENTOS_KEY_PREFIX = 'cajas:movimientos-ramas:';

/** Saldos de los 4 fondos + movimientos filtrados por rama/tipo/concepto/fecha. */
export function useFondosRama() {
  const fondos = useAsyncData({ key: FONDOS_KEY, load: fetchFondosRama });
  const [filters, setFilters] = useState<FilterValues>({});
  const [ramas, setRamas] = useState<readonly RamaChipValue[]>(ALL_RAMAS);

  const params = useMemo(
    () => movimientosRamasParams(filters, ramas),
    [filters, ramas],
  );
  const movimientos = useAsyncData({
    key: `${MOVIMIENTOS_KEY_PREFIX}${JSON.stringify(params)}`,
    load: (signal) => fetchMovimientosFiltrados(params, signal),
  });

  const stats = useMemo(
    () => buildFondosRamaStats(fondos.data ?? {}),
    [fondos.data],
  );

  return {
    stats,
    fondosLoading: fondos.isLoading && !fondos.data,
    fondosError: fondos.error,
    movimientos: movimientos.data ?? [],
    movimientosLoading: movimientos.isLoading,
    movimientosError: movimientos.error,
    filters,
    setFilters,
    ramas,
    toggleRama: (value: RamaChipValue) =>
      setRamas((prev) => toggleRamaChip(prev, value)),
  };
}
