/**
 * Inscripciones y campamentos de la ficha como una sola lista de obligaciones:
 * mismo shape para pintar las filas y elegir el año a mostrar.
 */
import { TIPO_INSCRIPCION_LABELS, type EstadoInscripcion } from '@/shared/domain';
import type { PersonaDashboard } from '@/features/personas/models/dashboard-schema';

export const OBLIGACION_KIND = {
  INSCRIPCION: 'inscripcion',
  CAMPAMENTO: 'campamento',
} as const;

export type ObligacionKind =
  (typeof OBLIGACION_KIND)[keyof typeof OBLIGACION_KIND];

export interface Obligacion {
  readonly kind: ObligacionKind;
  readonly id: string;
  readonly title: string;
  readonly ano: number;
  readonly pagado: number;
  readonly total: number;
  readonly pendiente: number;
  /** Solo inscripciones. */
  readonly estado?: EstadoInscripcion;
  /** Solo campamentos. */
  readonly autorizacionEntregada?: boolean;
}

export interface ObligacionesSource {
  readonly inscripciones: PersonaDashboard['inscripciones']['items'];
  readonly campamentos: PersonaDashboard['campamentos']['items'];
}

/** Año descendente; dentro de un año, inscripciones antes que campamentos. */
export function buildObligaciones(source: ObligacionesSource): Obligacion[] {
  const inscripciones = source.inscripciones.map(
    (item): Obligacion => ({
      kind: OBLIGACION_KIND.INSCRIPCION,
      id: item.id,
      title: TIPO_INSCRIPCION_LABELS[item.tipo],
      ano: item.ano,
      pagado: item.montoPagado + item.montoBonificado,
      total: item.montoTotal,
      pendiente: item.saldoPendiente,
      estado: item.estado,
    }),
  );
  const campamentos = source.campamentos.map(
    (item): Obligacion => ({
      kind: OBLIGACION_KIND.CAMPAMENTO,
      id: item.id,
      title: item.nombre,
      ano: item.ano,
      pagado: item.montoPagado,
      total: item.montoTotal,
      pendiente: item.saldoPendiente,
      autorizacionEntregada: item.autorizacionEntregada,
    }),
  );
  return [...inscripciones, ...campamentos].sort((a, b) => b.ano - a.ano);
}

/** Años presentes, del más reciente al más antiguo. */
export function obligacionYears(list: readonly Obligacion[]): number[] {
  return [...new Set(list.map((item) => item.ano))].sort((a, b) => b - a);
}

export function obligacionesOfYear(
  list: readonly Obligacion[],
  ano: number,
): Obligacion[] {
  return list.filter((item) => item.ano === ano);
}
