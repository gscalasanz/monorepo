'use client';

import { useSyncExternalStore } from 'react';

import { hasTokens } from '@/shared/auth/token-storage';

const subscribeNothing = (): (() => void) => () => undefined;
const unknownOnServer = (): null => null;

/**
 * ¿Hay tokens guardados? (port de `TokenService.hasTokens()` usado por el
 * reporte público). Sin guard ni redirect: solo informa. En SSR/hidratación
 * devuelve `null` (los tokens viven en localStorage), después `true`/`false`.
 */
export function useHasTokens(): boolean | null {
  return useSyncExternalStore(subscribeNothing, hasTokens, unknownOnServer);
}
