'use client';

import { useStore } from 'zustand';

import { ConfirmDialogView } from '@/shared/confirm/confirm-dialog-view';
import { confirmStore } from '@/shared/confirm/confirm-store';

/** Host único del diálogo de confirmación: montar una vez en el layout. */
export function ConfirmDialogHost() {
  const active = useStore(confirmStore, (state) => state.active);
  if (!active) return null;
  return <ConfirmDialogView key={active.id} active={active} />;
}
