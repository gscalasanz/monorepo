'use client';

import { useEffect, useState } from 'react';

import { extractErrorMessage } from '@/shared/api';
import { CONFIRM_COPY, CONFIRM_SUCCESS_CLOSE_MS } from '@/shared/confirm/copy';
import { settleConfirm, type ActiveConfirm } from '@/shared/confirm/confirm-store';
import { errorHintFor } from '@/shared/confirm/error-hint';

export type ConfirmPhase = 'confirm' | 'loading' | 'error' | 'success';

interface ConfirmFlow {
  readonly phase: ConfirmPhase;
  readonly error: string;
  readonly hint: string;
  readonly onConfirm: () => Promise<void>;
  readonly onCancel: () => void;
}

/** Máquina de estados del diálogo (simple o async). */
export function useConfirmFlow(active: ActiveConfirm): ConfirmFlow {
  const [phase, setPhase] = useState<ConfirmPhase>('confirm');
  const [error, setError] = useState('');

  useEffect(() => {
    if (phase !== 'success') return undefined;
    const timer = setTimeout(() => settleConfirm({ confirmed: true }), CONFIRM_SUCCESS_CLOSE_MS);
    return () => clearTimeout(timer);
  }, [phase]);

  async function onConfirm(): Promise<void> {
    if (!active.action) {
      settleConfirm({ confirmed: true });
      return;
    }
    setPhase('loading');
    try {
      await active.action();
      setPhase('success');
    } catch (cause) {
      setError(extractErrorMessage(cause, CONFIRM_COPY.UNEXPECTED));
      setPhase('error');
    }
  }

  function onCancel(): void {
    if (phase === 'loading') return;
    settleConfirm(phase === 'error' ? { confirmed: false, error } : { confirmed: false });
  }

  return { phase, error, hint: error ? errorHintFor(error) : '', onConfirm, onCancel };
}
