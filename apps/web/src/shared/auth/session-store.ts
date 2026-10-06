/** Estado de sesión (zustand vanilla: usable desde el cliente HTTP y desde React). */
import { createStore } from 'zustand/vanilla';

import type { AuthUser } from '@/shared/domain';

export interface SessionState {
  readonly user: AuthUser | null;
  /** Hay una operación de auth en curso (login, cambio de password…). */
  readonly isLoading: boolean;
  /** Ya se intentó restaurar la sesión desde storage. */
  readonly initialized: boolean;
}

export const sessionStore = createStore<SessionState>(() => ({
  user: null,
  isLoading: false,
  initialized: false,
}));
