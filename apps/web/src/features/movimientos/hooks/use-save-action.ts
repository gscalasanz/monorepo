'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { extractErrorMessage } from '@/shared/api';
import { notify } from '@/shared/notifications';
import { MOVIMIENTO_ROUTES } from '@/features/movimientos/constants/movimientos';

/**
 * Guardado de los forms: estado `saving`, toast de éxito y vuelta a la lista;
 * ante error, toast con el mensaje del back (o el genérico) y se re-habilita.
 */
export function useSaveAction(messages: {
  readonly success: string;
  readonly error: string;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function run(action: () => Promise<unknown>): Promise<void> {
    setSaving(true);
    try {
      await action();
      notify.success(messages.success);
      router.push(MOVIMIENTO_ROUTES.LIST);
    } catch (cause) {
      notify.error(extractErrorMessage(cause, messages.error));
      setSaving(false);
    }
  }

  return { saving, run, cancel: () => router.push(MOVIMIENTO_ROUTES.LIST) };
}
