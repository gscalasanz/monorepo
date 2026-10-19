'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

import {
  TAB_QUERY_PARAM,
  type PersonasTab,
} from '@/features/personas/constants/personas';
import { parsePersonasTab } from '@/features/personas/helpers/tabs';

/** Tab activa en `?tab=` (default Manada): sobrevive al refresh y al "volver". */
export function usePersonasTab(): {
  readonly tab: PersonasTab;
  readonly setTab: (next: PersonasTab) => void;
} {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const tab = parsePersonasTab(searchParams.get(TAB_QUERY_PARAM));

  const setTab = useCallback(
    (next: PersonasTab) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(TAB_QUERY_PARAM, next);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  return { tab, setTab };
}
