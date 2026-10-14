/** Reglas puras del detalle de evento (tabs, KPIs, habilitar movimientos). */
import {
  DESTINO_GANANCIA,
  TIPO_EVENTO,
  type Evento,
  type EventoKpis,
  type Producto,
  type TipoEvento,
} from '@/shared/domain';
import { EVENTOS_COPY } from '@/features/eventos/constants/copy';
import {
  EVENTO_TAB,
  type EventoTab,
} from '@/features/eventos/constants/eventos';

const K = EVENTOS_COPY.kpis;
const T = EVENTOS_COPY.tabs;

export interface EventoTabItem {
  readonly value: EventoTab;
  readonly label: string;
}

const TABS_VENTA: readonly EventoTabItem[] = [
  { value: EVENTO_TAB.PRODUCTOS, label: T.productos },
  { value: EVENTO_TAB.VENTAS, label: T.ventas },
  { value: EVENTO_TAB.ENTREGAS, label: T.entregas },
  { value: EVENTO_TAB.MOVIMIENTOS, label: T.movimientos },
];

const TABS_GRUPO: readonly EventoTabItem[] = [
  { value: EVENTO_TAB.MOVIMIENTOS, label: T.movimientos },
];

/** Venta: Productos, Ventas, Entregas, Movimientos · Grupo: Movimientos. */
export function tabsFor(tipo: TipoEvento): readonly EventoTabItem[] {
  return tipo === TIPO_EVENTO.VENTA ? TABS_VENTA : TABS_GRUPO;
}

/**
 * Tab inicial: `?tab` si existe para el tipo; si no, el primero (productos en
 * venta, movimientos en grupo: Angular dejaba grupo sin tab activo, se corrige).
 */
export function resolveTab(params: {
  readonly tipo: TipoEvento;
  readonly requested: string | null;
}): EventoTab {
  const tabs = tabsFor(params.tipo);
  const match = tabs.find((tab) => tab.value === params.requested);
  return match?.value ?? tabs[0]?.value ?? EVENTO_TAB.MOVIMIENTOS;
}

export interface KpiConfig {
  readonly id: keyof EventoKpis;
  readonly label: string;
  /** Qué representa el número (tooltip ⓘ). */
  readonly hint: string;
}

const BASE_KPIS: readonly KpiConfig[] = [
  { id: 'totalRecaudado', label: K.recaudado, hint: K.hints.totalRecaudado },
  { id: 'gananciaVentas', label: K.ganancia, hint: K.hints.gananciaVentas },
  { id: 'totalGastado', label: K.gastado, hint: K.hints.totalGastado },
  {
    id: 'totalPendienteReembolso',
    label: K.reembolsos,
    hint: K.hints.totalPendienteReembolso,
  },
  { id: 'balance', label: K.balance, hint: K.hints.balance },
];

const RECUPERO_KPI: KpiConfig = {
  id: 'totalRecuperado',
  label: K.recuperado,
  hint: K.hints.totalRecuperado,
};

/** "Costo recuperado (grupo)" solo aplica a venta con destino cuentas personales. */
export function kpiConfigsFor(
  evento: Pick<Evento, 'tipo' | 'destinoGanancia'>,
): readonly KpiConfig[] {
  const aplicaRecupero =
    evento.tipo === TIPO_EVENTO.VENTA &&
    evento.destinoGanancia === DESTINO_GANANCIA.CUENTAS_PERSONALES;
  return aplicaRecupero ? [...BASE_KPIS, RECUPERO_KPI] : BASE_KPIS;
}

export function productosSinCosto<
  T extends Pick<Producto, 'precioCosto' | 'nombre'>,
>(productos: readonly T[]): T[] {
  return productos.filter((producto) => producto.precioCosto === null);
}

/** Venta abierta que todavía no habilitó movimientos (los costos los valida el botón). */
export function puedeHabilitarMovimientos(
  evento: Pick<Evento, 'tipo' | 'movimientosHabilitados' | 'estaCerrado'>,
): boolean {
  return (
    evento.tipo === TIPO_EVENTO.VENTA &&
    !evento.movimientosHabilitados &&
    !evento.estaCerrado
  );
}

/** Ganancia unitaria (venta − costo) o `null` si falta el costo. */
export function gananciaUnitaria(
  producto: Pick<Producto, 'precioVenta' | 'precioCosto'>,
): number | null {
  return producto.precioCosto === null
    ? null
    : producto.precioVenta - producto.precioCosto;
}
