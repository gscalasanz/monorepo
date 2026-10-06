'use client';

import { useMemo, useState } from 'react';

import type { CajaConSaldo } from '@/shared/domain';
import { useAsyncData } from '@/shared/hooks';
import {
  DRAWER_FILTER,
  filterDrawerMovimientos,
  type DrawerFilter,
} from '@/features/cajas/helpers/movimientos';
import { fetchMovimientosCaja } from '@/features/cajas/services/cajas-api';

const KEY_PREFIX = 'cajas:drawer:';

/** Movimientos de la caja abierta en el drawer + filtro Todos/Ingresos/Egresos. */
export function useCajaDrawer(caja: CajaConSaldo) {
  const [filter, setFilter] = useState<DrawerFilter>(DRAWER_FILTER.TODOS);
  const { data, isLoading, error, reload } = useAsyncData({
    key: `${KEY_PREFIX}${caja.id}`,
    load: (signal) => fetchMovimientosCaja(caja.id, signal),
  });
  const movimientos = useMemo(
    () => filterDrawerMovimientos(data ?? [], filter),
    [data, filter],
  );
  return {
    filter,
    setFilter,
    movimientos,
    isLoading,
    error: data ? null : error,
    reload,
  };
}
