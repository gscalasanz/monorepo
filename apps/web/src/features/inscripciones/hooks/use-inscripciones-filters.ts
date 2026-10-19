'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

import type { TipoInscripcion } from '@/shared/domain';
import { currentYearBsAs } from '@/shared/time';
import {
  filtersToSearch,
  parseFilters,
  type InscripcionFilters,
} from '@/features/inscripciones/helpers/filters';

/** Filtros de lista/dashboard con la URL como fuente de verdad (`?tipo&ano&tipoDeuda&rama`). */
export function useInscripcionesFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const currentYear = currentYearBsAs();
  const filters = useMemo(
    () => parseFilters(searchParams, currentYear),
    [searchParams, currentYear],
  );

  const setFilters = useCallback(
    (next: InscripcionFilters) => {
      router.replace(`${pathname}?${filtersToSearch(next, currentYear)}`, {
        scroll: false,
      });
    },
    [router, pathname, currentYear],
  );

  const setTipo = useCallback(
    (tipo: TipoInscripcion) => setFilters({ ...filters, tipo }),
    [filters, setFilters],
  );

  return { filters, setFilters, setTipo, currentYear };
}
