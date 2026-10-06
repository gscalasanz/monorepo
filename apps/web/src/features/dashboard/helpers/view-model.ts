/** Transformaciones puras del dashboard (paridad con los `computed` de Angular). */
import {
  CAJA_TYPE,
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

export interface DashboardKpi {
  readonly id: string;
  readonly label: string;
  readonly value: number;
}

function saldoRama(consolidado: ConsolidadoSaldos, rama: Rama): number {
  const tipo = RAMA_TO_CAJA_TYPE[rama];
  return consolidado.fondosRama.detalle.find((f) => f.tipo === tipo)?.saldo ?? 0;
}

/** Los 6 KPIs en el orden de Angular (sin consolidado → 0). */
export function buildKpis(consolidado: ConsolidadoSaldos | null): readonly DashboardKpi[] {
  const c = consolidado;
  const fondos = c ? RAMAS.reduce((sum, rama) => sum + saldoRama(c, rama), 0) : 0;
  return [
    { id: CAJA_TYPE.GRUPO, label: C.KPI_CAJA_GRUPO, value: c?.cajaGrupo.saldo ?? 0 },
    { id: 'fondos-rama', label: C.KPI_FONDOS_RAMA, value: fondos },
    { id: 'cuentas', label: C.KPI_CUENTAS_PERSONALES, value: c?.cuentasPersonales.total ?? 0 },
    { id: 'reembolsos', label: C.KPI_REEMBOLSOS, value: c?.reembolsosPendientes.total ?? 0 },
    { id: 'cobros', label: C.KPI_COBROS, value: c?.cobrosPendientes.total ?? 0 },
    { id: CAJA_TYPE.FONDO_SOLIDARIO, label: C.KPI_FONDO_SOLIDARIO, value: c?.fondoSolidario.saldo ?? 0 },
  ];
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
  readonly detail: string;
  readonly amount: number;
}

export function recentMovimientos(movimientos: readonly Movimiento[]): readonly RecentMovimientoRow[] {
  return movimientos.slice(0, RECENT_MOVIMIENTOS_LIMIT).map((mov) => {
    const isIngreso = mov.tipo === TIPO_MOVIMIENTO.INGRESO;
    const responsable = mov.responsable?.nombre ?? C.SYSTEM;
    return {
      id: mov.id,
      direction: isIngreso ? 'in' : 'out',
      title: humanize(mov.descripcion ?? mov.concepto, 'none'),
      detail: `${responsable}${C.DETAIL_SEPARATOR}${formatDate(mov.fecha, DATE_FORMATS.date)}`,
      amount: isIngreso ? mov.monto : -mov.monto,
    };
  });
}
