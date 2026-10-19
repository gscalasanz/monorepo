'use client';

import { useAsyncData } from '@/shared/hooks';
import { fetchConsolidado } from '@/features/reportes/services/reportes-api';
import type { DeudaFilters } from '@/features/reportes/models/deudas';

/** Consolidado por origen: solo depende de la rama, así los orígenes ofrecidos no cambian al elegir uno. */
export function useConsolidado(rama: DeudaFilters['rama']) {
  return useAsyncData({
    key: `consolidado:${rama ?? ''}`,
    load: (signal) => fetchConsolidado(rama ? { rama } : {}, signal),
  });
}
