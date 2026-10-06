/** Reportes de ejemplo (validados con el schema real) para los tests del feature. */
import { reporteEventoSchema, type ReporteEvento } from '@/shared/domain';
import {
  omitKeys,
  REPORTE_VENTA_CAJA_GRUPO_FIXTURE,
} from '@/shared/domain/testing/fixtures';

const VENTA = {
  ...REPORTE_VENTA_CAJA_GRUPO_FIXTURE,
  kpis: {
    ...REPORTE_VENTA_CAJA_GRUPO_FIXTURE.kpis,
    recaudacionBruta: 10000,
    egresos: 2000,
    netoReal: 8000,
    margen: 0.8,
    unidades: 20,
  },
  egresos: [
    {
      descripcion: 'Harina',
      responsableNombre: 'Ana',
      medioPago: 'efectivo',
      estadoPago: 'pagado',
      monto: 1500,
    },
    {
      descripcion: 'Carbón',
      responsableNombre: null,
      medioPago: 'transferencia',
      estadoPago: 'pendiente_reembolso',
      monto: 500,
    },
  ],
  integridad: [
    { severidad: 'alta', mensaje: 'Hay ventas sin movimiento' },
    { severidad: 'ok', mensaje: 'Stock consistente' },
  ],
  productos: [
    {
      nombre: 'Empanada',
      precioCosto: 200,
      precioVenta: 500,
      margenUnitario: 300,
      unidades: 12,
      recaudado: 6000,
      porcentaje: 0.6,
    },
    {
      nombre: 'Pastelito',
      precioCosto: 100,
      precioVenta: 500,
      margenUnitario: 400,
      unidades: 8,
      recaudado: 4000,
      porcentaje: 0.4,
    },
  ],
  porTipoPersona: [
    {
      tipo: 'educador',
      label: 'Educadores',
      vendedores: 1,
      unidades: 8,
      recaudado: 4000,
      porcentaje: 0.4,
    },
    {
      tipo: 'protagonista',
      label: 'Protagonistas',
      vendedores: 2,
      unidades: 12,
      recaudado: 6000,
      porcentaje: 0.6,
    },
  ],
  porRama: [
    {
      grupo: 'Manada',
      esEducador: false,
      vendedores: 2,
      unidades: 12,
      recaudado: 6000,
      porcentaje: 0.6,
    },
    {
      grupo: 'Educadores',
      esEducador: true,
      vendedores: 1,
      unidades: 8,
      recaudado: 4000,
      porcentaje: 0.4,
    },
  ],
  vendedores: [
    {
      vendedorId: 'v2',
      nombre: 'Beto',
      tipo: 'protagonista',
      rama: 'Manada',
      unidades: 4,
      recaudado: 2000,
      porcentaje: 0.2,
      entregado: 4,
      pendiente: 0,
    },
    {
      vendedorId: 'v1',
      nombre: 'Carla',
      tipo: 'educador',
      rama: null,
      unidades: 8,
      recaudado: 4000,
      porcentaje: 0.4,
      entregado: 6,
      pendiente: 2,
    },
    {
      vendedorId: 'v3',
      nombre: 'Dani',
      tipo: 'protagonista',
      rama: 'Manada',
      unidades: 8,
      recaudado: 4000,
      porcentaje: 0.4,
      entregado: 8,
      pendiente: 0,
    },
  ],
  stock: {
    productos: [
      { nombre: 'Empanada', vendido: 12, entregado: 10, pendiente: 2 },
      { nombre: 'Pastelito', vendido: 8, entregado: 8, pendiente: 0 },
    ],
    totalVendido: 20,
    totalEntregado: 18,
    totalPendiente: 2,
  },
  horariosEntrega: {
    diaPrincipal: 'sábado 25/05',
    franjas: [
      { desde: '18:00', hasta: '18:30', entregas: 2, porciones: 6 },
      { desde: '18:30', hasta: '19:00', entregas: 3, porciones: 12 },
    ],
    totalEntregas: 5,
    totalPorciones: 18,
    fueraDeDia: [{ dia: 'domingo 26/05', entregas: 1, porciones: 2 }],
  },
};

export const REPORTE_VENTA: ReporteEvento = reporteEventoSchema.parse(VENTA);

export const REPORTE_PERSONALES: ReporteEvento = reporteEventoSchema.parse({
  ...VENTA,
  variante: 'venta_cuentas_personales',
  evento: { ...VENTA.evento, destinoGanancia: 'cuentas_personales' },
  kpis: { ...VENTA.kpis, recuperoCosto: 1200 },
  gananciaPorPersona: [{ personaId: 'v2', nombre: 'Beto', ganancia: 900 }],
});

const LADO = {
  recaudado: 5000,
  ganancia: 3000,
  unidades: 10,
  pendienteCobro: 0,
  neto: 4000,
};

export const REPORTE_MIXTO: ReporteEvento = reporteEventoSchema.parse({
  ...VENTA,
  variante: 'venta_mixta',
  evento: { ...VENTA.evento, destinoGanancia: 'caja_grupo' },
  gananciaPorPersona: [],
  porDestino: {
    cajaGrupo: { ...LADO, pendienteCobro: 300 },
    cuentasPersonales: { ...LADO, neto: 2500, pendienteCobro: 200 },
  },
});

export const REPORTE_GRUPO: ReporteEvento = reporteEventoSchema.parse({
  ...omitKeys(REPORTE_VENTA_CAJA_GRUPO_FIXTURE, [
    'productos',
    'stock',
    'porTipoPersona',
    'porRama',
    'vendedores',
    'horariosEntrega',
  ]),
  variante: 'grupo',
  evento: {
    ...REPORTE_VENTA_CAJA_GRUPO_FIXTURE.evento,
    nombre: 'Peña anual',
    tipo: 'grupo',
    destinoGanancia: null,
    estaCerrado: true,
  },
  ingresosItemizados: [
    {
      descripcion: 'Entradas',
      responsableNombre: 'Ana',
      medioPago: 'efectivo',
      monto: 3000,
      fecha: '2026-05-25T21:00:00.000Z',
    },
  ],
});
