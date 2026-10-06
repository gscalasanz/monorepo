'use client';

import { useMemo } from 'react';

import { useAsyncData } from '@/shared/hooks';
import { todayBsAs } from '@/shared/time';
import { fetchDashboardData } from '@/features/dashboard/services/dashboard-api';
import {
  buildFondosRama,
  buildKpis,
  recentMovimientos,
  upcomingEventos,
} from '@/features/dashboard/helpers/view-model';

const DASHBOARD_KEY = 'dashboard';

/** Datos del dashboard ya transformados para la vista. */
export function useDashboard() {
  const { data, isLoading } = useAsyncData({ key: DASHBOARD_KEY, load: fetchDashboardData });
  return useMemo(
    () => ({
      isLoading: isLoading && !data,
      kpis: buildKpis(data?.consolidado ?? null),
      fondos: buildFondosRama(data?.consolidado ?? null),
      eventos: upcomingEventos(data?.eventos ?? [], todayBsAs()),
      movimientos: recentMovimientos(data?.recientes ?? []),
    }),
    [data, isLoading],
  );
}
