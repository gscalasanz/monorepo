/**
 * Diálogo de confirmación imperativo (port de `ConfirmDialogService`).
 * - `confirm()` / `confirmDelete()`: modo simple, resuelve `boolean`.
 * - `run()` / `runDelete()`: modo async, ejecuta la acción dentro del diálogo
 *   (confirmar → procesando → éxito | error) y resuelve `ConfirmResult`.
 * Un solo diálogo a la vez; el host (`ConfirmDialogHost`) se monta una vez.
 */
import { createStore } from 'zustand/vanilla';

import { CONFIRM_COPY } from '@/shared/confirm/copy';

export interface ConfirmDetail {
  readonly label: string;
  readonly value: string;
}

export interface ConfirmOptions {
  readonly title: string;
  readonly message: string;
  readonly confirmText?: string;
  readonly cancelText?: string;
  readonly destructive?: boolean;
  readonly details?: readonly ConfirmDetail[];
  readonly warning?: string;
  readonly entityName?: string;
}

export interface ConfirmResult {
  readonly confirmed: boolean;
  readonly error?: string;
}

export interface ActiveConfirm extends ConfirmOptions {
  readonly id: number;
  readonly action?: () => Promise<unknown>;
  readonly resolve: (result: ConfirmResult) => void;
}

interface ConfirmState {
  readonly active: ActiveConfirm | null;
}

export const confirmStore = createStore<ConfirmState>(() => ({ active: null }));

let sequence = 0;

function open(options: ConfirmOptions, action?: () => Promise<unknown>): Promise<ConfirmResult> {
  // Si había uno abierto, se cancela (no puede haber dos).
  confirmStore.getState().active?.resolve({ confirmed: false });
  sequence += 1;
  return new Promise<ConfirmResult>((resolve) => {
    confirmStore.setState({ active: { ...options, id: sequence, action, resolve } });
  });
}

/** Cierra el diálogo activo con el resultado dado. */
export function settleConfirm(result: ConfirmResult): void {
  const { active } = confirmStore.getState();
  if (!active) return;
  confirmStore.setState({ active: null });
  active.resolve(result);
}

function deleteOptions(entityName: string, extra?: Partial<ConfirmOptions>): ConfirmOptions {
  return {
    title: extra?.title ?? CONFIRM_COPY.deleteTitle(entityName),
    message: extra?.message ?? CONFIRM_COPY.deleteMessage(entityName),
    confirmText: CONFIRM_COPY.DELETE,
    destructive: true,
    entityName,
    warning: extra?.warning,
  };
}

export const confirmDialog = {
  confirm: async (options: ConfirmOptions): Promise<boolean> =>
    (await open(options)).confirmed,
  confirmDelete: async (entityName: string): Promise<boolean> =>
    (await open(deleteOptions(entityName))).confirmed,
  run: (options: ConfirmOptions & { readonly action: () => Promise<unknown> }) =>
    open(options, options.action),
  runDelete: (
    entityName: string,
    config: { readonly action: () => Promise<unknown> } & Partial<ConfirmOptions>,
  ) => open(deleteOptions(entityName, config), config.action),
} as const;
