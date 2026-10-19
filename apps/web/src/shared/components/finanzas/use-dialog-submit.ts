'use client';

import { useCallback, useState } from 'react';

import { extractErrorMessage } from '@/shared/api';

export interface DialogSubmitOptions<T> {
  readonly onSubmit: (values: T) => Promise<void>;
  readonly onOpenChange: (open: boolean) => void;
}

export interface DialogSubmit<T> {
  readonly saving: boolean;
  /** Mensaje del último intento fallido (el diálogo queda abierto). */
  readonly error: string | null;
  readonly submit: (values: T) => Promise<void>;
  /** `onOpenChange` que no deja cerrar mientras se guarda. */
  readonly handleOpenChange: (open: boolean) => void;
}

/**
 * Envío de un diálogo de form: `saving` mientras corre `onSubmit`; si resuelve
 * cierra, si rechaza queda abierto mostrando el mensaje (nunca se traga).
 */
export function useDialogSubmit<T>({
  onSubmit,
  onOpenChange,
}: DialogSubmitOptions<T>): DialogSubmit<T> {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    async (values: T): Promise<void> => {
      setSaving(true);
      setError(null);
      try {
        await onSubmit(values);
        setSaving(false);
        onOpenChange(false);
      } catch (cause) {
        setSaving(false);
        setError(extractErrorMessage(cause));
      }
    },
    [onSubmit, onOpenChange],
  );

  const handleOpenChange = useCallback(
    (open: boolean): void => {
      if (saving) return;
      setError(null);
      onOpenChange(open);
    },
    [saving, onOpenChange],
  );

  return { saving, error, submit, handleOpenChange };
}
