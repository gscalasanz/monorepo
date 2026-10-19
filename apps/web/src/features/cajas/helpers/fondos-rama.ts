/** Lógica pura de la tab "Fondos de Rama" (port de `FondosRamaComponent`). */
import type { QueryParams } from '@/shared/api';
import type { DateRangeValue, FilterValues } from '@/shared/components/data';
import {
  CAJA_TYPE_LABELS,
  FONDO_RAMA_TYPES,
  type CajaConSaldo,
  type FondoRamaType,
} from '@/shared/domain';
import { MOVIMIENTOS_RAMAS_QUERY } from '@/features/cajas/constants/cajas';
import { dayFilterBounds } from '@/shared/time';

/** Selección de chips: `null` = "Todas". */
export type RamaChipValue = FondoRamaType | null;

export const ALL_RAMAS: readonly RamaChipValue[] = [null];

/**
 * Chips multi-selección: "Todas" limpia el resto; elegir una rama saca "Todas";
 * si no queda ninguna, vuelve a "Todas". Siempre devuelve una lista nueva.
 */
export function toggleRamaChip(
  selected: readonly RamaChipValue[],
  value: RamaChipValue,
): RamaChipValue[] {
  if (value === null) return [...ALL_RAMAS];
  const ramas = selected.filter((item): item is FondoRamaType => item !== null);
  const next = ramas.includes(value)
    ? ramas.filter((item) => item !== value)
    : [...ramas, value];
  return next.length === 0 ? [...ALL_RAMAS] : next;
}

/** `tipoCaja` CSV: todas las ramas si está "Todas" (o nada), si no las elegidas. */
export function tipoCajaParam(selected: readonly RamaChipValue[]): string {
  const ramas = selected.filter((item): item is FondoRamaType => item !== null);
  if (selected.includes(null) || ramas.length === 0)
    return FONDO_RAMA_TYPES.join(',');
  return ramas.join(',');
}

function stringFilter(value: FilterValues[string]): string | undefined {
  return typeof value === 'string' && value !== '' ? value : undefined;
}

function rangeFilter(value: FilterValues[string]): DateRangeValue {
  return typeof value === 'object' ? value : {};
}

/** Filtros de la barra (`tipo`, `concepto`, `fecha`) → query de `GET /movimientos`. */
export function movimientosRamasParams(
  filters: FilterValues,
  selected: readonly RamaChipValue[],
): QueryParams {
  const fecha = dayFilterBounds(rangeFilter(filters.fecha));
  return {
    ...MOVIMIENTOS_RAMAS_QUERY,
    tipoCaja: tipoCajaParam(selected),
    tipo: stringFilter(filters.tipo),
    concepto: stringFilter(filters.concepto),
    fechaInicio: fecha.from,
    fechaFin: fecha.to,
  };
}

export interface FondoRamaStat {
  readonly tipo: FondoRamaType;
  readonly label: string;
  readonly saldo: number;
  /** Id de la caja (null si el fondo no existe: sin botón "+"). */
  readonly cajaId: string | null;
}

export interface FondosRamaStats {
  readonly total: number;
  readonly fondos: readonly FondoRamaStat[];
}

/** Saldos por fondo (0 si no existe) y total, en orden de ramas. */
export function buildFondosRamaStats(
  cajas: Readonly<Partial<Record<FondoRamaType, CajaConSaldo>>>,
): FondosRamaStats {
  const fondos = FONDO_RAMA_TYPES.map((tipo) => {
    const caja = cajas[tipo];
    return {
      tipo,
      label: CAJA_TYPE_LABELS[tipo],
      saldo: caja?.saldoActual ?? 0,
      cajaId: caja?.id ?? null,
    };
  });
  return { total: fondos.reduce((sum, fondo) => sum + fondo.saldo, 0), fondos };
}
