/** Filtros y resumen de la lista de eventos (todo en el cliente, como Angular). */
import type { FilterField, FilterValues } from '@/shared/components/data';
import {
  TIPO_EVENTO,
  TIPO_EVENTO_LABELS,
  type Evento,
  type TipoEvento,
} from '@/shared/domain';
import { EVENTOS_COPY } from '@/features/eventos/constants/copy';

const C = EVENTOS_COPY.list;

export const EVENTO_FILTER_KEYS = {
  BUSQUEDA: 'busqueda',
  TIPO: 'tipo',
} as const;

/** "Buscar" (nombre) + "Tipo" (Todos / Evento de Venta / Evento de Grupo). */
export const EVENTO_FILTER_FIELDS: readonly FilterField[] = [
  {
    key: EVENTO_FILTER_KEYS.BUSQUEDA,
    type: 'search',
    label: C.searchLabel,
    placeholder: C.searchPlaceholder,
  },
  {
    key: EVENTO_FILTER_KEYS.TIPO,
    type: 'chips',
    label: C.tipoLabel,
    options: Object.values(TIPO_EVENTO).map((value) => ({
      value,
      label: TIPO_EVENTO_LABELS[value],
    })),
  },
];

function stringFilter(values: FilterValues, key: string): string {
  const value = values[key];
  return typeof value === 'string' ? value : '';
}

function isTipoEvento(value: string): value is TipoEvento {
  return Object.values<string>(TIPO_EVENTO).includes(value);
}

/** Filtra por tipo y por nombre (contiene, sin distinguir mayúsculas). */
export function filterEventos(params: {
  readonly eventos: readonly Evento[];
  readonly values: FilterValues;
}): Evento[] {
  const tipo = stringFilter(params.values, EVENTO_FILTER_KEYS.TIPO);
  const busqueda = stringFilter(params.values, EVENTO_FILTER_KEYS.BUSQUEDA)
    .trim()
    .toLowerCase();
  return params.eventos.filter(
    (evento) =>
      (!isTipoEvento(tipo) || evento.tipo === tipo) &&
      (!busqueda || evento.nombre.toLowerCase().includes(busqueda)),
  );
}

export interface EventoStats {
  readonly total: number;
  readonly venta: number;
  readonly grupo: number;
}

/** Totales sobre la lista completa (sin filtrar). */
export function eventoStats(eventos: readonly Evento[]): EventoStats {
  const venta = eventos.filter(
    (evento) => evento.tipo === TIPO_EVENTO.VENTA,
  ).length;
  return { total: eventos.length, venta, grupo: eventos.length - venta };
}
