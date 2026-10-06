'use client';

import { useCallback, useMemo, useState } from 'react';

import type { FilterValues } from '@/shared/components/data';
import { confirmDialog } from '@/shared/confirm';
import type { Evento } from '@/shared/domain';
import { useAsyncData } from '@/shared/hooks';
import { notify } from '@/shared/notifications';
import { EVENTOS_COPY } from '@/features/eventos/constants/copy';
import {
  eventoStats,
  filterEventos,
} from '@/features/eventos/helpers/evento-list';
import {
  deleteEvento,
  fetchEventos,
} from '@/features/eventos/services/eventos-api';

const LIST_KEY = 'eventos:list';

/** Lista de eventos: carga, filtros en el cliente, stats y borrado con confirmación. */
export function useEventosList() {
  const query = useAsyncData({ key: LIST_KEY, load: fetchEventos });
  const [values, setValues] = useState<FilterValues>({});
  const eventos = useMemo(() => query.data ?? [], [query.data]);
  const { setData } = query;

  const remove = useCallback(
    async (evento: Evento): Promise<void> => {
      const result = await confirmDialog.runDelete(
        EVENTOS_COPY.entities.evento,
        {
          action: () => deleteEvento(evento.id),
        },
      );
      if (!result.confirmed) return;
      setData((current) => current?.filter((item) => item.id !== evento.id));
      notify.success(EVENTOS_COPY.card.deleted);
    },
    [setData],
  );

  return {
    eventos,
    filtered: useMemo(
      () => filterEventos({ eventos, values }),
      [eventos, values],
    ),
    stats: useMemo(() => eventoStats(eventos), [eventos]),
    values,
    setValues,
    isLoading: query.isLoading && query.data === undefined,
    error: query.data === undefined ? query.error : null,
    reload: query.reload,
    remove,
  };
}
