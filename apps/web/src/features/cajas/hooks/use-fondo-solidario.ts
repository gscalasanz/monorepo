'use client';

import { useCallback, useMemo, useState } from 'react';

import { confirmDialog } from '@/shared/confirm';
import { useAsyncData } from '@/shared/hooks';
import { notify } from '@/shared/notifications';
import { CAJAS_COPY as C } from '@/features/cajas/constants/copy';
import { buildFondoSolidarioView } from '@/features/cajas/helpers/fondo-solidario';
import {
  createFondoSolidario,
  deleteMovimiento,
  fetchFondoSolidarioData,
} from '@/features/cajas/services/cajas-api';

const KEY = 'cajas:fondo-solidario';

/** Saldo, bonificado, creación del fondo y transferencias recibidas (con borrado). */
export function useFondoSolidario() {
  const { data, isLoading, error, reload } = useAsyncData({
    key: KEY,
    load: fetchFondoSolidarioData,
  });
  const [creating, setCreating] = useState(false);
  const view = useMemo(
    () => (data ? buildFondoSolidarioView(data) : null),
    [data],
  );

  async function crear(): Promise<void> {
    setCreating(true);
    try {
      await createFondoSolidario();
      notify.success(C.CAJA_CREADA);
      await reload();
    } catch {
      // El error del backend ya lo muestra el toast global de `apiClient`.
    } finally {
      setCreating(false);
    }
  }

  const eliminarTransferencia = useCallback(
    async (id: string): Promise<void> => {
      const result = await confirmDialog.runDelete(C.TRANSFERENCIA_ENTITY, {
        action: () => deleteMovimiento(id),
        warning: C.DELETE_WARNING,
      });
      if (result.confirmed) await reload();
    },
    [reload],
  );

  return {
    view,
    isLoading: isLoading && !data,
    error: data ? null : error,
    creating,
    crear,
    eliminarTransferencia,
    reload,
  };
}
