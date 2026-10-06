'use client';

/** Hooks de sesión para React (sin UI). */
import { useRouter } from 'next/navigation';
import { useEffect, useSyncExternalStore } from 'react';
import { useStore } from 'zustand';

import {
  evaluateAuthGuard,
  evaluateNoAuthGuard,
  type GuardDecision,
} from '@/shared/auth/guard';
import { isTokenValid } from '@/shared/auth/jwt';
import { saveRedirectUrl } from '@/shared/auth/redirect-url';
import { sessionStore } from '@/shared/auth/session-store';
import { getAccessToken, getRefreshToken } from '@/shared/auth/token-storage';
import type { AuthUser } from '@/shared/domain';

export type GuardStatus = 'checking' | 'allowed' | 'redirecting';

export interface GuardState {
  readonly status: GuardStatus;
}

function currentTokenValidity() {
  return {
    accessValid: isTokenValid(getAccessToken()),
    refreshValid: isTokenValid(getRefreshToken()),
  };
}

const subscribeNothing = (): (() => void) => () => undefined;

/**
 * Evalúa un guard en el cliente (los tokens viven en localStorage: en SSR el
 * estado es `checking`). La redirección se hace una vez por montaje, como
 * `canActivate` por navegación.
 */
function useGuard(evaluate: () => GuardDecision): GuardState {
  const router = useRouter();
  const allowed = useSyncExternalStore(
    subscribeNothing,
    () => evaluate().allowed,
    () => null,
  );
  useEffect(() => {
    const decision = evaluate();
    if (!decision.allowed) {
      if (decision.redirectUrlToSave)
        saveRedirectUrl(decision.redirectUrlToSave);
      router.replace(decision.redirectTo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (allowed === null) return { status: 'checking' };
  return { status: allowed ? 'allowed' : 'redirecting' };
}

/** Layout autenticado: deja pasar con access o refresh válido; si no, a /login guardando la URL. */
export function useRequireSession(): GuardState {
  return useGuard(() =>
    evaluateAuthGuard({
      ...currentTokenValidity(),
      currentUrl: `${window.location.pathname}${window.location.search}`,
    }),
  );
}

/** Página de login: si ya hay sesión, al dashboard. */
export function useRedirectIfAuthenticated(): GuardState {
  return useGuard(() => evaluateNoAuthGuard(currentTokenValidity()));
}

export interface SessionView {
  readonly user: AuthUser | null;
  readonly isAuthenticated: boolean;
  readonly isLoading: boolean;
  readonly initialized: boolean;
}

export function useSession(): SessionView {
  const user = useStore(sessionStore, (s) => s.user);
  const isLoading = useStore(sessionStore, (s) => s.isLoading);
  const initialized = useStore(sessionStore, (s) => s.initialized);
  return { user, isAuthenticated: user !== null, isLoading, initialized };
}
