/**
 * Bus mínimo de errores globales (equivale al snackbar de `errorInterceptor`).
 * El cliente HTTP publica acá; la UI de toasts se suscribe (`useGlobalErrors`)
 * y descarta con `dismissGlobalError`. Store vanilla: usable fuera de React.
 */
import { useStore } from 'zustand';
import { createStore } from 'zustand/vanilla';

export interface GlobalError {
  readonly id: string;
  readonly message: string;
}

interface GlobalErrorState {
  readonly errors: readonly GlobalError[];
}

export const globalErrorStore = createStore<GlobalErrorState>(() => ({
  errors: [],
}));

let sequence = 0;

export function publishGlobalError(message: string): void {
  sequence += 1;
  const error: GlobalError = { id: `global-error-${sequence}`, message };
  globalErrorStore.setState((state) => ({ errors: [...state.errors, error] }));
}

export function dismissGlobalError(id: string): void {
  globalErrorStore.setState((state) => ({
    errors: state.errors.filter((e) => e.id !== id),
  }));
}

/** Hook para la UI de toasts. */
export function useGlobalErrors(): readonly GlobalError[] {
  return useStore(globalErrorStore, (state) => state.errors);
}
