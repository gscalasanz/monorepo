'use client';

/** Hooks de sesión para React (sin UI). */
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useSyncExternalStore } from 'react';
import { useStore } from 'zustand';

import {
  evaluateAuthGuard,
  evaluateNoAuthGuard,
  type GuardDecision,
  type TokenValidity,
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

function currentTokenValidity(): TokenValidity {
  return {
    accessValid: isTokenValid(getAccessToken()),
    refreshValid: isTokenValid(getRefreshToken()),
  };
}

/** `pathname + search` actual (solo en el cliente). */
function currentUrl(): string {
  return `${window.location.pathname}${window.location.search}`;
}

const requireSession = (): GuardDecision =>
  evaluateAuthGuard({ ...currentTokenValidity(), currentUrl: currentUrl() });

const redirectIfAuthenticated = (): GuardDecision =>
  evaluateNoAuthGuard(currentTokenValidity());

const subscribeNothing = (): (() => void) => () => undefined;

/**
 * Evalúa un guard en el cliente (los tokens viven en localStorage: en SSR el
 * estado es `checking`). Se re-evalúa en cada navegación (cambio de
 * `pathname`), como `canActivate` en Angular.
 */
function useGuard(evaluate: () => GuardDecision): GuardState {
  const router = useRouter();
  const pathname = usePathname();
  const allowed = useSyncExternalStore(
    subscribeNothing,
    () => evaluate().allowed,
    () => null,
  );
  useEffect(() => {
    const decision = evaluate();
    if (decision.allowed) return;
    if (decision.redirectUrlToSave) saveRedirectUrl(decision.redirectUrlToSave);
    router.replace(decision.redirectTo);
  }, [evaluate, pathname, router]);
  if (allowed === null) return { status: 'checking' };
  return { status: allowed ? 'allowed' : 'redirecting' };
}

/** Layout autenticado: deja pasar con access o refresh válido; si no, a /login guardando la URL. */
export function useRequireSession(): GuardState {
  return useGuard(requireSession);
}

/** Página de login: si ya hay sesión, al dashboard. */
export function useRedirectIfAuthenticated(): GuardState {
  return useGuard(redirectIfAuthenticated);
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
