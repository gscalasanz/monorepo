'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

import {
  TAB_QUERY_PARAM,
  type CajasTab,
} from '@/features/cajas/constants/cajas';
import { parseCajasTab } from '@/features/cajas/helpers/tabs';

/** Tab activa en `?tab=` (default `grupo`): sobrevive al refresh y al "volver". */
export function useCajasTab(): {
  readonly tab: CajasTab;
  readonly setTab: (next: CajasTab) => void;
} {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const tab = parseCajasTab(searchParams.get(TAB_QUERY_PARAM));

  const setTab = useCallback(
    (next: CajasTab) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(TAB_QUERY_PARAM, next);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  return { tab, setTab };
}
