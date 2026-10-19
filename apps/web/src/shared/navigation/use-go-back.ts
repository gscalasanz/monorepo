'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import { canGoBackInApp } from '@/shared/navigation/history';

/**
 * "Volver" real: equivale a la flecha atrás del navegador. Si la página se abrió directo (sin
 * historial interno) cae a `fallbackHref` para no sacar al usuario de la app.
 */
export function useGoBack(fallbackHref: string): () => void {
  const router = useRouter();
  return useCallback(() => {
    if (canGoBackInApp()) router.back();
    else router.push(fallbackHref);
  }, [router, fallbackHref]);
}
