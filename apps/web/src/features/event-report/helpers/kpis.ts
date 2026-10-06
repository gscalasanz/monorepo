/** KPIs por variante (port de `ventaKpiItems`/`destinoKpiItems`/`grupoKpiItems`). */
import {
  PERSONA_TYPE,
  REPORTE_VARIANTE,
  type ReporteEvento,
} from '@/shared/domain';
import { formatMoney } from '@/shared/format';
import { EVENT_REPORT_COPY } from '@/features/event-report/constants/copy';
import { formatPct } from '@/features/event-report/helpers/format';
import type {
  ReporteGrupo,
  ReporteMixto,
  ReportKpi,
  ReporteVenta,
} from '@/features/event-report/models/report';

const COPY = EVENT_REPORT_COPY.kpis;

function vendedoresPorTipo(vm: ReporteVenta, tipo: string): number {
  return vm.porTipoPersona.find((t) => t.tipo === tipo)?.vendedores ?? 0;
}

/** Solo destino cuentas_personales genera recupero (> 0); en caja_grupo es 0. */
function recuperoKpi(vm: ReporteVenta): readonly ReportKpi[] {
  if (vm.kpis.recuperoCosto <= 0) return [];
  return [
    {
      id: 'recupero',
      label: COPY.recuperoCosto,
      value: formatMoney(vm.kpis.recuperoCosto),
      sub: COPY.recuperoCostoSub,
    },
  ];
}

export function ventaKpis(vm: ReporteVenta): readonly ReportKpi[] {
  const educ = vendedoresPorTipo(vm, PERSONA_TYPE.EDUCADOR);
  const prot = vendedoresPorTipo(vm, PERSONA_TYPE.PROTAGONISTA);
  return [
    {
      id: 'recaudacion',
      label: COPY.recaudacionBruta,
      value: formatMoney(vm.kpis.recaudacionBruta),
      sub: COPY.unidadesVendidas(vm.kpis.unidades),
    },
    {
      id: 'neto',
      label: COPY.netoReal,
      value: formatMoney(vm.kpis.netoReal),
      sub: COPY.netoRealSub,
    },
    {
      id: 'egresos',
      label: COPY.egresos,
      value: formatMoney(vm.kpis.egresos),
      sub: COPY.egresosSub(vm.egresos.length),
    },
    {
      id: 'margen',
      label: COPY.margenNeto,
      value: formatPct(vm.kpis.margen),
      sub: COPY.margenNetoSub,
    },
    {
      id: 'vendedores',
      label: COPY.vendedores,
      value: String(vm.vendedores.length),
      sub: COPY.vendedoresSub(educ, prot),
    },
    {
      id: 'pendiente-retiro',
      label: COPY.pendienteRetiro,
      value: String(vm.stock.totalPendiente),
      sub: COPY.pendienteRetiroSub(vm.stock.totalVendido),
    },
    ...recuperoKpi(vm),
  ];
}

/**
 * Evento mixto: cada destino por separado. El neto del grupo ya viene con los
 * egresos descontados; el personal es la suma de márgenes sin descuento.
 */
export function destinoKpis(vm: ReporteMixto): readonly ReportKpi[] {
  const { cajaGrupo, cuentasPersonales } = vm.porDestino;
  const pendiente = cajaGrupo.pendienteCobro + cuentasPersonales.pendienteCobro;
  const aCobrar: readonly ReportKpi[] =
    pendiente > 0
      ? [
          {
            id: 'a-cobrar',
            label: COPY.aCobrar,
            value: formatMoney(pendiente),
            sub: COPY.aCobrarSub,
          },
        ]
      : [];
  return [
    {
      id: 'neto-grupo',
      label: COPY.netoCajaGrupo,
      value: formatMoney(cajaGrupo.neto),
      sub: COPY.netoCajaGrupoSub(formatMoney(cajaGrupo.recaudado)),
    },
    {
      id: 'neto-personales',
      label: COPY.netoCuentasPersonales,
      value: formatMoney(cuentasPersonales.neto),
      sub: COPY.netoCuentasPersonalesSub(
        formatMoney(cuentasPersonales.recaudado),
      ),
    },
    ...aCobrar,
  ];
}

export function grupoKpis(vm: ReporteGrupo): readonly ReportKpi[] {
  return [
    {
      id: 'ingresos',
      label: COPY.ingresos,
      value: formatMoney(vm.kpis.recaudacionBruta),
    },
    { id: 'egresos', label: COPY.egresos, value: formatMoney(vm.kpis.egresos) },
    {
      id: 'neto',
      label: COPY.resultadoNeto,
      value: formatMoney(vm.kpis.netoReal),
    },
    { id: 'margen', label: COPY.margen, value: formatPct(vm.kpis.margen) },
  ];
}

/** KPIs del reporte según su variante. */
export function kpisFor(vm: ReporteEvento): readonly ReportKpi[] {
  switch (vm.variante) {
    case REPORTE_VARIANTE.GRUPO:
      return grupoKpis(vm);
    case REPORTE_VARIANTE.VENTA_MIXTA:
      return [...ventaKpis(vm), ...destinoKpis(vm)];
    default:
      return ventaKpis(vm);
  }
}
