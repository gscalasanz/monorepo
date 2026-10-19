'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { markHistoryPop, recordNavigation } from '@/shared/navigation/history';

/** Alimenta `history.ts` con cada cambio de ruta (path + query). Se monta una vez en el layout. */
export function NavigationTracker() {
  const pathname = usePathname();
  const search = useSearchParams().toString();

  useEffect(() => {
    window.addEventListener('popstate', markHistoryPop);
    return () => window.removeEventListener('popstate', markHistoryPop);
  }, []);

  useEffect(() => {
    recordNavigation(search ? `${pathname}?${search}` : pathname);
  }, [pathname, search]);

  return null;
}
