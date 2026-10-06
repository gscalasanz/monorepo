/**
 * Fixtures con la forma EXACTA del JSON que devuelve el backend (decimales de
 * entidades crudas como string, fechas `date` como `YYYY-MM-DD`). Solo para tests.
 */
const TIMESTAMP = '2026-03-13T15:00:00.000Z';

const BASE_ENTITY = {
  createdAt: TIMESTAMP,
  updatedAt: TIMESTAMP,
  deletedAt: null,
} as const;

export const MOVIMIENTO_FIXTURE = {
  ...BASE_ENTITY,
  id: 'mov-1',
  cajaId: 'caja-1',
  tipo: 'egreso',
  monto: '1500.50',
  concepto: 'gasto_general',
  categoria: null,
  descripcion: 'Garrafa',
  responsableId: 'per-1',
  medioPago: 'efectivo',
  requiereComprobante: true,
  comprobanteEntregado: null,
  estadoPago: 'pagado',
  personaAReembolsarId: null,
  fecha: TIMESTAMP,
  eventoId: null,
  campamentoId: null,
  inscripcionId: null,
  movimientoRelacionadoId: null,
  registradoPorId: null,
} as const;

export const PROTAGONISTA_FIXTURE = {
  ...BASE_ENTITY,
  id: 'per-1',
  tipo: 'protagonista',
  nombre: 'Juan',
  estado: 'activo',
  email: null,
  emailVerified: false,
  rama: 'Manada',
  partidaNacimiento: true,
  dni: true,
  dniPadres: false,
  carnetObraSocial: false,
} as const;

export const EDUCADOR_FIXTURE = {
  ...BASE_ENTITY,
  id: 'per-2',
  tipo: 'educador',
  nombre: 'Laura',
  estado: 'activo',
  email: 'laura@scout.ar',
  emailVerified: false,
  rama: null,
  cargo: 'Jefe de Grupo',
} as const;

export const EXTERNO_FIXTURE = {
  ...BASE_ENTITY,
  id: 'per-3',
  tipo: 'externo',
  nombre: 'Ana',
  estado: 'inactivo',
  email: null,
  emailVerified: false,
  contacto: null,
  notas: 'Mamá de Juan',
} as const;

export const AGRUPACION_FIXTURE = {
  ...BASE_ENTITY,
  id: 'per-4',
  tipo: 'agrupacion',
  nombre: 'Grupo Scout',
  estado: 'activo',
  email: null,
  emailVerified: false,
  descripcion: null,
} as const;

export const CAJA_RESPONSE_FIXTURE = {
  id: 'caja-2',
  tipo: 'personal',
  nombre: null,
  propietarioId: 'per-1',
  propietario: { id: 'per-1', nombre: 'Juan', estado: 'activo', rama: 'Manada' },
  saldoActual: 2500,
  createdAt: TIMESTAMP,
  updatedAt: TIMESTAMP,
} as const;

export const INSCRIPCION_RESPONSE_FIXTURE = {
  id: 'ins-1',
  personaId: 'per-1',
  tipo: 'scout_argentina',
  ano: 2026,
  montoTotal: 30000,
  montoBonificado: 0,
  declaracionDeSalud: true,
  autorizacionDeImagen: false,
  salidasCercanas: true,
  autorizacionIngreso: false,
  certificadoAptitudFisica: false,
  createdAt: TIMESTAMP,
  updatedAt: TIMESTAMP,
  estado: 'parcial',
  montoPagado: 10000,
  saldoPendiente: 20000,
  persona: { id: 'per-1', nombre: 'Juan', tipo: 'protagonista', rama: 'Manada' },
  movimientos: [
    {
      id: 'mov-9',
      monto: 10000,
      medioPago: 'transferencia',
      fecha: TIMESTAMP,
      descripcion: null,
      tipo: 'ingreso',
      concepto: 'inscripcion_scout_argentina',
    },
  ],
} as const;

export const CAMPAMENTO_FIXTURE = {
  ...BASE_ENTITY,
  id: 'cam-1',
  nombre: 'Campamento de verano',
  fechaInicio: '2026-01-15',
  fechaFin: '2026-01-20',
  costoPorPersona: '45000.00',
  costoEducadores: '0.00',
  cuotasBase: 3,
  descripcion: null,
} as const;

export const PRODUCTO_FIXTURE = {
  ...BASE_ENTITY,
  id: 'prod-1',
  eventoId: 'evt-1',
  nombre: 'Pastelitos',
  precioCosto: null,
  precioVenta: '1200.00',
} as const;

export const EVENTO_FIXTURE = {
  ...BASE_ENTITY,
  id: 'evt-1',
  nombre: 'Venta de pastelitos',
  fecha: '2026-05-25',
  descripcion: null,
  tipo: 'venta',
  destinoGanancia: 'cuentas_personales',
  modalidadVenta: 'unica',
  tipoEvento: null,
  estaCerrado: false,
  reportePublico: true,
  movimientosHabilitados: true,
  productos: [PRODUCTO_FIXTURE],
} as const;

export const VENTA_FIXTURE = {
  ...BASE_ENTITY,
  id: 'ven-1',
  eventoId: 'evt-1',
  productoId: 'prod-1',
  vendedorId: 'per-1',
  cantidad: 12,
  destinoGanancia: 'cuentas_personales',
  estadoCobro: 'cobrado',
  movimientoId: 'mov-1',
  movimientoRecuperoId: null,
} as const;

const REPORTE_BASE = {
  generadoEn: TIMESTAMP,
  evento: {
    id: 'evt-1',
    nombre: 'Venta de pastelitos',
    fecha: '2026-05-25',
    tipo: 'venta',
    destinoGanancia: 'caja_grupo',
    estaCerrado: false,
  },
  kpis: {
    recaudacionBruta: 100,
    ganancia: 40,
    egresos: 10,
    netoReal: 30,
    margen: 0.4,
    unidades: 5,
    pendienteReembolso: 0,
    recuperoCosto: 0,
  },
  egresos: [
    {
      descripcion: 'Harina',
      responsableNombre: null,
      medioPago: 'efectivo',
      estadoPago: 'pagado',
      monto: 10,
    },
  ],
  integridad: [{ severidad: 'ok', mensaje: 'Todo en orden' }],
} as const;

export const REPORTE_VENTA_CAJA_GRUPO_FIXTURE = {
  ...REPORTE_BASE,
  variante: 'venta_caja_grupo',
  productos: [],
  porTipoPersona: [],
  porRama: [],
  vendedores: [],
  stock: { productos: [], totalVendido: 0, totalEntregado: 0, totalPendiente: 0 },
  horariosEntrega: {
    diaPrincipal: '2026-05-25',
    franjas: [],
    totalEntregas: 0,
    totalPorciones: 0,
    fueraDeDia: [],
  },
} as const;

/** Copia sin las claves dadas (simula respuestas donde TypeORM omite columnas). */
export function omitKeys<T extends object>(source: T, keys: readonly string[]): Partial<T> {
  return Object.fromEntries(
    Object.entries(source).filter(([key]) => !keys.includes(key)),
  ) as Partial<T>;
}
