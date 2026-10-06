import type { FilterField } from '@/shared/components/data';
import { RAMAS } from '@/shared/domain';
import { REPORTES_COPY as C } from '@/features/reportes/constants/copy';

/** Primer año del filtro (paridad: del año actual hacia atrás hasta 2020). */
export const FIRST_REPORT_YEAR = 2020;
export const RAMA_EDUCADORES = 'Educadores';

export const FILTER_KEYS = { RAMA: 'rama', ANO: 'ano', TIPO: 'tipo' } as const;

const TIPO_OPTIONS = [
  { value: 'dinero', label: 'Dinero (todas)' },
  { value: 'campamentos', label: 'Campamentos' },
  { value: 'inscripcionesScout', label: 'Inscripciones Scout AR' },
  { value: 'inscripcionesGrupo', label: 'Inscripciones Grupo' },
  { value: 'documentacion', label: 'Documentación' },
] as const;

export function yearOptions(currentYear: number): readonly { value: string; label: string }[] {
  const count = currentYear - FIRST_REPORT_YEAR + 1;
  return Array.from({ length: Math.max(count, 1) }, (_, i) => {
    const year = String(currentYear - i);
    return { value: year, label: year };
  });
}

export function deudaFilterFields(currentYear: number): readonly FilterField[] {
  return [
    {
      key: FILTER_KEYS.RAMA,
      type: 'select',
      label: C.FILTER_RAMA,
      options: [...RAMAS.map((r) => ({ value: r, label: r })), { value: RAMA_EDUCADORES, label: RAMA_EDUCADORES }],
    },
    { key: FILTER_KEYS.ANO, type: 'select', label: C.FILTER_ANO, options: yearOptions(currentYear) },
    { key: FILTER_KEYS.TIPO, type: 'select', label: C.FILTER_TIPO, options: TIPO_OPTIONS },
  ];
}
