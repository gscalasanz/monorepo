/** Transformaciones puras del dashboard (paridad con los `computed` de Angular). */
import { seriesColor } from '@/shared/components/charts';
import { CAJAS_TAB, cajasHref, movimientoEditHref } from '@/shared/constants';
import {
  CAJA_TYPE_LABELS,
  MEDIO_PAGO_LABELS,
  RAMAS,
  RAMA_TO_CAJA_TYPE,
  TIPO_MOVIMIENTO,
  type ConsolidadoSaldos,
  type Evento,
  type Movimiento,
  type Rama,
} from '@/shared/domain';
import { humanize } from '@/shared/format';
import { DATE_FORMATS, formatDate, type LocalDate } from '@/shared/time';
import { DASHBOARD_COPY as C } from '@/features/dashboard/constants/copy';
import {
  RECENT_MOVIMIENTOS_LIMIT,
  UPCOMING_EVENTS_LIMIT,
} from '@/features/dashboard/constants/dashboard';

function saldoRama(consolidado: ConsolidadoSaldos, rama: Rama): number {
  const tipo = RAMA_TO_CAJA_TYPE[rama];
  return consolidado.fondosRama.detalle.find((f) => f.tipo === tipo)?.saldo ?? 0;
}

export interface TreasurySegment {
  readonly id: string;
  readonly label: string;
  readonly value: number;
  /** Color CSS (token de serie): orden fijo, nunca por ranking. */
  readonly color: string;
  /** Pestaña de Cajas de esa parte. */
  readonly href: string;
}

export interface TreasuryModel {
  /** `resumen.totalGeneral`: caja grupo + fondos de rama + cuentas personales + fondo solidario. */
  readonly total: number;
  /** `resumen.totalPorCobrar`: deuda total de inscripciones y campamentos. */
  readonly porCobrar: number;
  readonly segments: readonly TreasurySegment[];
  readonly reembolsos: number;
  readonly cobros: number;
}

/** Panel "Dinero del grupo": total, reparto por caja y pendientes (sin consolidado → 0). */
export function buildTreasury(consolidado: ConsolidadoSaldos | null): TreasuryModel {
  const c = consolidado;
  const fondos = c ? RAMAS.reduce((sum, rama) => sum + saldoRama(c, rama), 0) : 0;
  return {
    total: c?.resumen.totalGeneral ?? 0,
    porCobrar: c?.resumen.totalPorCobrar ?? 0,
    segments: [
      { id: 'grupo', label: C.KPI_CAJA_GRUPO, value: c?.cajaGrupo.saldo ?? 0, color: seriesColor(0), href: cajasHref(CAJAS_TAB.GRUPO) },
      { id: 'fondos-rama', label: C.KPI_FONDOS_RAMA, value: fondos, color: seriesColor(1), href: cajasHref(CAJAS_TAB.RAMA) },
      { id: 'cuentas', label: C.KPI_CUENTAS_PERSONALES, value: c?.cuentasPersonales.total ?? 0, color: seriesColor(3), href: cajasHref(CAJAS_TAB.PERSONAL) },
      { id: 'fondo-solidario', label: C.KPI_FONDO_SOLIDARIO, value: c?.fondoSolidario.saldo ?? 0, color: seriesColor(2), href: cajasHref(CAJAS_TAB.FONDO_SOLIDARIO) },
    ],
    reembolsos: c?.reembolsosPendientes.total ?? 0,
    cobros: c?.cobrosPendientes.total ?? 0,
  };
}

export interface FondoRamaRow {
  readonly rama: Rama;
  readonly saldo: number;
}

/** Una fila por rama presente en el consolidado, en orden de ramas. */
export function buildFondosRama(consolidado: ConsolidadoSaldos | null): readonly FondoRamaRow[] {
  if (!consolidado) return [];
  const tipos = new Set(consolidado.fondosRama.detalle.map((f) => f.tipo));
  return RAMAS.filter((rama) => tipos.has(RAMA_TO_CAJA_TYPE[rama])).map((rama) => ({
    rama,
    saldo: saldoRama(consolidado, rama),
  }));
}

/** Eventos con fecha ≥ hoy (BsAs), ascendentes, máx. 3. */
export function upcomingEventos(eventos: readonly Evento[], today: LocalDate): readonly Evento[] {
  return [...eventos]
    .filter((evento) => evento.fecha >= today)
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
    .slice(0, UPCOMING_EVENTS_LIMIT);
}

export interface RecentMovimientoRow {
  readonly id: string;
  readonly direction: 'in' | 'out';
  readonly title: string;
  readonly responsable: string;
  readonly caja: string;
  readonly medio: string;
  /** `13 mar`. */
  readonly fecha: string;
  readonly amount: number;
  /** Edición del movimiento. */
  readonly href: string;
}

const cajaLabel = (mov: Movimiento): string =>
  mov.caja ? (mov.caja.nombre ?? CAJA_TYPE_LABELS[mov.caja.tipo]) : C.EMPTY;

export function recentMovimientos(movimientos: readonly Movimiento[]): readonly RecentMovimientoRow[] {
  return movimientos.slice(0, RECENT_MOVIMIENTOS_LIMIT).map((mov) => {
    const isIngreso = mov.tipo === TIPO_MOVIMIENTO.INGRESO;
    return {
      id: mov.id,
      direction: isIngreso ? 'in' : 'out',
      title: humanize(mov.descripcion ?? mov.concepto, 'none'),
      responsable: mov.responsable?.nombre ?? C.SYSTEM,
      caja: cajaLabel(mov),
      medio: MEDIO_PAGO_LABELS[mov.medioPago],
      fecha: formatDate(mov.fecha, DATE_FORMATS.dayMonth).replace('.', ''),
      amount: isIngreso ? mov.monto : -mov.monto,
      href: movimientoEditHref(mov.id),
    };
  });
}
