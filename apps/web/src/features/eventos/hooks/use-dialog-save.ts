'use client';

import { useCallback, useState } from 'react';

import { extractErrorMessage } from '@/shared/api';

/**
 * Guardado de un diálogo: `saving` mientras corre; si resuelve cierra, si
 * rechaza queda abierto con el mensaje (nunca se traga el error).
 */
export function useDialogSave(onOpenChange: (open: boolean) => void) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(
    async (action: () => Promise<void>): Promise<void> => {
      setSaving(true);
      setError(null);
      try {
        await action();
        setSaving(false);
        onOpenChange(false);
      } catch (cause) {
        setSaving(false);
        setError(extractErrorMessage(cause));
      }
    },
    [onOpenChange],
  );

  const handleOpenChange = useCallback(
    (open: boolean): void => {
      if (saving) return;
      setError(null);
      onOpenChange(open);
    },
    [saving, onOpenChange],
  );

  return { saving, error, run, handleOpenChange };
}
