'use client';

import { useCallback, useMemo } from 'react';

import { confirmDialog } from '@/shared/confirm';
import { useAsyncData } from '@/shared/hooks';
import { notify } from '@/shared/notifications';
import { todayBsAs } from '@/shared/time';
import { LIST_COPY as C } from '@/features/campamentos/constants/copy';
import { campStats } from '@/features/campamentos/helpers/camp-status';
import { deleteCampamento, fetchCampamentos } from '@/features/campamentos/services/campamentos-api';

const LIST_KEY = 'campamentos';

/** Lista de campamentos + eliminación con confirmación (el error se ve en el diálogo). */
export function useCampamentosList() {
  const query = useAsyncData({ key: LIST_KEY, load: fetchCampamentos });
  const campamentos = useMemo(() => query.data ?? [], [query.data]);
  const stats = useMemo(() => campStats(campamentos, todayBsAs()), [campamentos]);
  const { setData } = query;

  const remove = useCallback(
    async (id: string): Promise<void> => {
      const result = await confirmDialog.runDelete(C.ENTITY, {
        action: () => deleteCampamento(id, { skipGlobalError: true }),
      });
      if (!result.confirmed) return;
      setData((current) => current?.filter((c) => c.id !== id));
      notify.success(C.DELETED);
    },
    [setData],
  );

  return {
    campamentos,
    stats,
    isLoading: query.isLoading && query.data === undefined,
    error: query.error,
    reload: query.reload,
    remove,
  };
}
