'use client';

import { useCallback, useMemo, useState } from 'react';

import type { TransferenciaOrigen } from '@/shared/components/transferencia';
import { useAsyncData } from '@/shared/hooks';
import { notify } from '@/shared/notifications';
import { FICHA_COPY as C } from '@/features/personas/constants/copy';
import type { PersonaDashboard } from '@/features/personas/models/dashboard-schema';
import { fetchPersonaDashboard } from '@/features/personas/services/personas-api';

const FICHA_KEY_PREFIX = 'persona-dashboard:';

/** Origen fijo del modal: la cuenta personal de la persona. */
function toTransferOrigen(dashboard: PersonaDashboard): TransferenciaOrigen {
  const nombre = dashboard.persona.nombre || C.FALLBACK_NAME;
  return {
    id: dashboard.cuentaPersonal.id,
    saldo: dashboard.cuentaPersonal.saldo,
    nombre: C.TRANSFER_ORIGEN(nombre),
  };
}

/** Ficha de protagonista/educador: carga el dashboard y controla el modal "Transferir fondos". */
export function usePersonaFicha(id: string) {
  const { data, error, isLoading, reload } = useAsyncData({
    key: `${FICHA_KEY_PREFIX}${id}`,
    load: (signal) => fetchPersonaDashboard({ id, signal }),
  });
  const [transferOpen, setTransferOpen] = useState(false);
  const transferOrigen = useMemo(
    () => (data ? toTransferOrigen(data) : null),
    [data],
  );

  const openTransfer = useCallback((): void => {
    if (data && data.cuentaPersonal.saldo > 0) setTransferOpen(true);
  }, [data]);

  const onTransferSuccess = useCallback((): void => {
    notify.success(C.TRANSFER_OK);
    void reload();
  }, [reload]);

  return {
    dashboard: data,
    error: data ? null : error,
    isLoading: isLoading && !data,
    transferOpen,
    transferOrigen,
    setTransferOpen,
    openTransfer,
    onTransferSuccess,
  };
}
