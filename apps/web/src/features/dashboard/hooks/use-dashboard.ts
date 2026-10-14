'use client';

import { useMemo } from 'react';

import { useAsyncData } from '@/shared/hooks';
import { currentYearBsAs, todayBsAs } from '@/shared/time';
import { fetchDashboardData } from '@/features/dashboard/services/dashboard-api';
import { buildDebtors } from '@/features/dashboard/helpers/debtors';
import { buildInscripcionesSummary } from '@/features/dashboard/helpers/inscripciones-summary';
import {
  buildFondosRama,
  buildTreasury,
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
      /** `undefined` hasta que carga: el gráfico espera este total para anclar el saldo. */
      hasConsolidado: Boolean(data?.consolidado),
      treasury: buildTreasury(data?.consolidado ?? null),
      fondos: buildFondosRama(data?.consolidado ?? null),
      eventos: upcomingEventos(data?.eventos ?? [], todayBsAs()),
      movimientos: recentMovimientos(data?.recientes ?? []),
      lastMovimientoAt: data?.recientes[0]?.fecha,
      debtors: buildDebtors(data?.deudas ?? []),
      inscripciones: buildInscripcionesSummary(data?.inscripciones ?? []),
      inscripcionesAno: currentYearBsAs(),
    }),
    [data, isLoading],
  );
}
