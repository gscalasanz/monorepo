'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import { confirmDialog } from '@/shared/confirm';
import { formatMoney } from '@/shared/format';
import { useAsyncData } from '@/shared/hooks';
import { notify } from '@/shared/notifications';
import { FICHA_COPY as C } from '@/features/personas/constants/copy';
import { PERSONA_ROUTES } from '@/features/personas/constants/personas';
import type { PersonaDashboard } from '@/features/personas/models/dashboard-schema';
import {
  fetchPersonaDashboard,
  transferirSaldoAGrupo,
} from '@/features/personas/services/personas-api';

const FICHA_KEY_PREFIX = 'persona-dashboard:';

/** Confirma y transfiere todo el saldo personal a la caja del grupo; vuelve al listado. */
async function confirmTransfer(dashboard: PersonaDashboard): Promise<boolean> {
  const saldo = formatMoney(dashboard.cuentaPersonal.saldo);
  const nombre = dashboard.persona.nombre || C.FALLBACK_NAME;
  let transferido = dashboard.cuentaPersonal.saldo;
  const result = await confirmDialog.run({
    title: C.TRANSFER_TITLE(saldo),
    message: C.TRANSFER_MESSAGE({ saldo, nombre }),
    confirmText: C.TRANSFER_CONFIRM,
    cancelText: C.TRANSFER_CANCEL,
    action: async () => {
      transferido = (await transferirSaldoAGrupo(dashboard.persona.id))
        .saldoTransferido;
    },
  });
  if (result.confirmed) notify.success(C.TRANSFER_OK(formatMoney(transferido)));
  return result.confirmed;
}

/** Ficha de protagonista/educador: carga el dashboard y expone "Transferir a caja grupo". */
export function usePersonaFicha(id: string) {
  const router = useRouter();
  const { data, error, isLoading } = useAsyncData({
    key: `${FICHA_KEY_PREFIX}${id}`,
    load: (signal) => fetchPersonaDashboard({ id, signal }),
  });

  const transfer = useCallback(async (): Promise<void> => {
    if (!data || data.cuentaPersonal.saldo <= 0) return;
    if (await confirmTransfer(data)) router.push(PERSONA_ROUTES.LIST);
  }, [data, router]);

  return {
    dashboard: data,
    error: data ? null : error,
    isLoading: isLoading && !data,
    transfer,
  };
}
