'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { extractErrorMessage } from '@/shared/api';

export interface AsyncData<T> {
  readonly data: T | undefined;
  /** Mensaje humano del último error (o `null`). */
  readonly error: string | null;
  /** `true` mientras hay una carga en vuelo (inicial, cambio de key o recarga). */
  readonly isLoading: boolean;
  /** Vuelve a cargar con la misma `key`. Resuelve cuando termina. */
  readonly reload: () => Promise<void>;
  /** Reemplaza el dato en memoria (actualizaciones locales, inmutables). */
  readonly setData: (updater: (current: T | undefined) => T | undefined) => void;
}

export interface AsyncDataOptions<T> {
  /** Identidad de la consulta: si cambia, se vuelve a cargar (y se aborta la anterior). */
  readonly key: string;
  readonly load: (signal: AbortSignal) => Promise<T>;
  /** `false` = no cargar todavía (p. ej. falta un id). */
  readonly enabled?: boolean;
}

interface Settled<T> {
  /** Key de la última carga terminada (`null` = nunca terminó una). */
  readonly key: string | null;
  readonly data: T | undefined;
  readonly error: string | null;
}

/**
 * Carga datos asíncronos en un Client Component: aborta la request anterior
 * al cambiar `key` o desmontar, e ignora respuestas viejas (sin carreras).
 * `isLoading` se deriva (key pedida ≠ key resuelta), sin setState síncrono en efectos.
 */
export function useAsyncData<T>({ key, load, enabled = true }: AsyncDataOptions<T>): AsyncData<T> {
  const [settled, setSettled] = useState<Settled<T>>({ key: null, data: undefined, error: null });
  const [reloading, setReloading] = useState(false);
  const loadRef = useRef(load);
  const runIdRef = useRef(0);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    loadRef.current = load;
  });

  const run = useCallback(async (runKey: string): Promise<void> => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    runIdRef.current += 1;
    const runId = runIdRef.current;
    try {
      const data = await loadRef.current(controller.signal);
      if (runId === runIdRef.current) setSettled({ key: runKey, data, error: null });
    } catch (cause) {
      if (runId !== runIdRef.current || controller.signal.aborted) return;
      setSettled((prev) => ({ ...prev, key: runKey, error: extractErrorMessage(cause) }));
    }
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;
    void run(key);
    return () => {
      runIdRef.current += 1;
      controllerRef.current?.abort();
    };
  }, [key, enabled, run]);

  const reload = useCallback(async (): Promise<void> => {
    setReloading(true);
    try {
      await run(key);
    } finally {
      setReloading(false);
    }
  }, [key, run]);

  const setData = useCallback((updater: (current: T | undefined) => T | undefined) => {
    setSettled((prev) => ({ ...prev, data: updater(prev.data) }));
  }, []);

  const isLoading = enabled && (settled.key !== key || reloading);
  return { data: settled.data, error: settled.error, isLoading, reload, setData };
}
