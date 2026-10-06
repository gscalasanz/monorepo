'use client';

import { useMemo } from 'react';

import { useAsyncData } from '@/shared/hooks';
import { ultimosMovimientos } from '@/features/cajas/helpers/movimientos';
import { fetchCajaGrupoData } from '@/features/cajas/services/cajas-api';

const KEY = 'cajas:grupo';

/** Caja de grupo + sus últimos movimientos. */
export function useCajaGrupo() {
  const { data, isLoading, error, reload } = useAsyncData({
    key: KEY,
    load: fetchCajaGrupoData,
  });
  const ultimos = useMemo(
    () => ultimosMovimientos(data?.movimientos ?? []),
    [data],
  );
  return {
    caja: data?.caja ?? null,
    ultimos,
    isLoading: isLoading && !data,
    error: data ? null : error,
    reload,
  };
}
