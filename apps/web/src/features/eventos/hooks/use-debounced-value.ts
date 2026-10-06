'use client';

import { useEffect, useState } from 'react';

import { UI_CONFIG } from '@/shared/constants';

/** Valor que se actualiza `delayMs` después del último cambio (búsquedas al backend). */
export function useDebouncedValue<T>(
  value: T,
  delayMs: number = UI_CONFIG.DEBOUNCE_TIME_MS,
): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);
  return debounced;
}
