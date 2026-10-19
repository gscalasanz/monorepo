'use client';

import { useCallback, useSyncExternalStore } from 'react';

/** Breakpoint donde la tabla densa pasa a lista (DESIGN §Tabla densa: <860px). */
export const MOBILE_LIST_QUERY = '(max-width: 859.98px)';

/**
 * `matchMedia` reactivo y SSR-safe (en servidor devuelve `serverFallback`,
 * por defecto `false`, para que el primer render coincida con desktop).
 */
export function useMediaQuery(query: string, serverFallback = false): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverFallback,
  );
}
