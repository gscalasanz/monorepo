'use client';

import { useEffect, useRef, useState } from 'react';

import { UI_CONFIG } from '@/shared/constants';

/**
 * Borrador local que se confirma con debounce. Si el valor externo cambia
 * (ej. "Limpiar filtros"), el borrador se resincroniza y no se reemite nada.
 */
export function useDebouncedCommit(params: {
  readonly value: string;
  readonly onCommit: (value: string) => void;
  readonly delayMs?: number;
}): readonly [string, (next: string) => void] {
  const { value, onCommit, delayMs = UI_CONFIG.DEBOUNCE_TIME_MS } = params;
  const [draft, setDraft] = useState(value);
  const [synced, setSynced] = useState(value);
  const commitRef = useRef(onCommit);

  useEffect(() => {
    commitRef.current = onCommit;
  }, [onCommit]);

  if (value !== synced) {
    setSynced(value);
    setDraft(value);
  }

  useEffect(() => {
    if (draft === value) return undefined;
    const timer = setTimeout(() => commitRef.current(draft), delayMs);
    return () => clearTimeout(timer);
  }, [draft, value, delayMs]);

  return [draft, setDraft] as const;
}
