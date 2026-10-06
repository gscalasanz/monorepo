'use client';

/**
 * Activa el keep-alive mientras el componente esté montado (lo monta el layout
 * autenticado). Sin UI. SSR-safe: los timers solo existen dentro del effect.
 */
import { useEffect } from 'react';

import { apiClient } from '@/shared/api/api-client';
import { API_ENDPOINTS } from '@/shared/api/endpoints';
import { createKeepAlive } from '@/shared/api/keep-alive';
import { setActivityListener } from '@/shared/api/registry';

/** Ping como en Angular: GET a la base, sin reiniciar el timer de inactividad. */
function pingBackend(): Promise<string> {
  return apiClient.getText(API_ENDPOINTS.ROOT, { isKeepAlive: true });
}

export function useKeepAlive(): void {
  useEffect(() => {
    const keepAlive = createKeepAlive({ ping: pingBackend });
    setActivityListener(keepAlive.notifyActivity);
    keepAlive.notifyActivity();
    return () => {
      setActivityListener(null);
      keepAlive.stop();
    };
  }, []);
}
