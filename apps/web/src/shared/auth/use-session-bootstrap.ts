'use client';

/**
 * Arranque de la sesión: montar UNA vez en el layout `(app)` (sin UI).
 * - restaura la sesión desde storage (`initializeSession`);
 * - registra `router.replace` como navegador de logout/cambio de password;
 * - activa el keep-alive del backend.
 */
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useKeepAlive } from '@/shared/api';
import { setAuthNavigator } from '@/shared/auth/navigation';
import { initializeSession } from '@/shared/auth/session';

export function useSessionBootstrap(): void {
  const router = useRouter();
  useKeepAlive();
  useEffect(() => {
    setAuthNavigator(router.replace);
    return () => setAuthNavigator(null);
  }, [router]);
  useEffect(() => {
    void initializeSession();
  }, []);
}
