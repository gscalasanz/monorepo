/**
 * Endpoints del backend, relativos a `NEXT_PUBLIC_API_URL` (`.../api/v1`).
 * Port de `shared/constants/api.constants.ts` + builders de las rutas con id que
 * hoy arman a mano los services de Angular (verificadas contra los controllers).
 */
import { pathSegment } from '@/shared/api/path-segment';

export const API_ENDPOINTS = {
  /** `GET /` (público, texto plano): ping de keep-alive. */
  ROOT: '',

  AUTH_LOGIN: 'auth/login',
  AUTH_REGISTER: 'auth/register',
  AUTH_REFRESH: 'auth/refresh',
  AUTH_LOGOUT: 'auth/logout',
  AUTH_ME: 'auth/me',
  AUTH_PASSWORD: 'auth/password',
  AUTH_EMAIL: 'auth/email',

  PERSONAS: 'personas',
  PROTAGONISTAS: 'personas/protagonistas',
  EDUCADORES: 'personas/educadores',
  PERSONAS_EXTERNAS: 'personas/externas',
  /** Stub: hoy el backend siempre devuelve `[]`. */
  PERSONAS_CON_DEUDAS: 'personas/con-deudas',
  /** Único listado que incluye la agrupación "Grupo Scout". */
  PERSONAS_VENDEDORES_ELEGIBLES: 'personas/vendedores-elegibles',
  persona: (id: string): string => `personas/${pathSegment(id)}`,
  personaDashboard: (id: string): string =>
    `personas/${pathSegment(id)}/dashboard`,
  personaTransferirSaldo: (id: string): string =>
    `personas/${pathSegment(id)}/transferir-saldo-a-grupo`,

  CAJAS: 'cajas',
  CAJAS_GRUPO: 'cajas/grupo',
  CAJAS_CONSOLIDADO: 'cajas/consolidado',
  CAJAS_FONDO_SOLIDARIO: 'cajas/fondo-solidario',
  caja: (id: string): string => `cajas/${pathSegment(id)}`,
  saldoPersonal: (personaId: string): string =>
    `cajas/personal/${pathSegment(personaId)}/saldo`,

  MOVIMIENTOS: 'movimientos',
  MOVIMIENTOS_RECIENTES: 'movimientos/recientes',
  MOVIMIENTOS_REEMBOLSOS_PENDIENTES: 'movimientos/reembolsos-pendientes',
  MOVIMIENTOS_COBROS_PENDIENTES: 'movimientos/cobros-pendientes',
  MOVIMIENTOS_TRANSFERENCIA: 'movimientos/transferencia',
  MOVIMIENTOS_GASTO_GENERAL: 'movimientos/gasto-general',
  movimiento: (id: string): string => `movimientos/${pathSegment(id)}`,
  movimientosSaldo: (cajaId: string): string =>
    `movimientos/saldo/${pathSegment(cajaId)}`,
  movimientosCaja: (cajaId: string): string =>
    `movimientos/caja/${pathSegment(cajaId)}`,

  INSCRIPCIONES: 'inscripciones',
  INSCRIPCIONES_CONSOLIDADO: 'inscripciones/consolidado',
  inscripcion: (id: string): string => `inscripciones/${pathSegment(id)}`,
  inscripcionPagar: (id: string): string =>
    `inscripciones/${pathSegment(id)}/pagar`,
  inscripcionBonificacion: (id: string): string =>
    `inscripciones/${pathSegment(id)}/bonificacion`,
  /** Borrar un pago de inscripción (el backend bloquea `DELETE /movimientos/:id` para estos). */
  inscripcionPago: (params: { readonly id: string; readonly movimientoId: string }): string =>
    `inscripciones/${pathSegment(params.id)}/pagos/${pathSegment(params.movimientoId)}`,

  CAMPAMENTOS: 'campamentos',
  campamento: (id: string): string => `campamentos/${pathSegment(id)}`,
  campamentoDetalle: (id: string): string =>
    `campamentos/${pathSegment(id)}/detalle`,
  campamentoParticipantes: (id: string): string =>
    `campamentos/${pathSegment(id)}/participantes`,
  campamentoParticipante: (id: string, personaId: string): string =>
    `campamentos/${pathSegment(id)}/participantes/${pathSegment(personaId)}`,
  campamentoBonificacion: (id: string, personaId: string): string =>
    `campamentos/${pathSegment(id)}/participantes/${pathSegment(personaId)}/bonificacion`,
  /** POST con `personaId`; DELETE con `movimientoId` (mismo prefijo en el backend). */
  campamentoPagos: (id: string, personaOrMovimientoId: string): string =>
    `campamentos/${pathSegment(id)}/pagos/${pathSegment(personaOrMovimientoId)}`,
  campamentoGastos: (id: string): string =>
    `campamentos/${pathSegment(id)}/gastos`,

  EVENTOS: 'eventos',
  evento: (id: string): string => `eventos/${pathSegment(id)}`,
  /** Update/delete de producto: sin eventoId en la ruta. */
  producto: (productoId: string): string =>
    `eventos/productos/${pathSegment(productoId)}`,
  eventoReporte: (id: string): string => `eventos/${pathSegment(id)}/reporte`,
  eventoReportePublico: (id: string): string =>
    `eventos/${pathSegment(id)}/reporte/publico`,
  /** `PATCH {reportePublico}` (prende/apaga el reporte sin login). */
  eventoReportePublicoToggle: (id: string): string =>
    `eventos/${pathSegment(id)}/reporte-publico`,
  eventoKpis: (id: string): string => `eventos/${pathSegment(id)}/kpis`,
  eventoCerrar: (id: string): string => `eventos/${pathSegment(id)}/cerrar`,
  eventoHabilitarMovimientos: (id: string): string =>
    `eventos/${pathSegment(id)}/habilitar-movimientos`,
  eventoProductos: (id: string): string =>
    `eventos/${pathSegment(id)}/productos`,
  eventoVentas: (id: string): string => `eventos/${pathSegment(id)}/ventas`,
  eventoVentasLote: (id: string): string =>
    `eventos/${pathSegment(id)}/ventas/lote`,
  eventoVenta: (id: string, ventaId: string): string =>
    `eventos/${pathSegment(id)}/ventas/${pathSegment(ventaId)}`,
  eventoVentaCobrar: (id: string, ventaId: string): string =>
    `eventos/${pathSegment(id)}/ventas/${pathSegment(ventaId)}/cobrar`,
  eventoMovimientos: (id: string): string =>
    `eventos/${pathSegment(id)}/movimientos`,
  eventoIngresos: (id: string): string => `eventos/${pathSegment(id)}/ingresos`,
  eventoGastos: (id: string): string => `eventos/${pathSegment(id)}/gastos`,
  eventoEntregas: (id: string): string => `eventos/${pathSegment(id)}/entregas`,
  /** Literal antes que `:entregaId` en el backend. */
  eventoEntregasStock: (id: string): string =>
    `eventos/${pathSegment(id)}/entregas/stock-disponible`,
  eventoEntrega: (id: string, entregaId: string): string =>
    `eventos/${pathSegment(id)}/entregas/${pathSegment(entregaId)}`,

  /** Público (sin auth) en el backend. */
  REPORTES_DEUDAS: 'reportes/deudas',
  EXPORTS_XLSX: 'exports/xlsx',
  BACKUPS_DOWNLOAD: 'backups/download',
} as const;

export const QUERY_PARAMS = {
  SOLO_ACTIVOS: 'soloActivos',
} as const;

/** Endpoints que no llevan token ni disparan refresh (públicos o de la propia auth). */
export const UNAUTHENTICATED_ENDPOINTS: readonly string[] = [
  API_ENDPOINTS.AUTH_LOGIN,
  API_ENDPOINTS.AUTH_REGISTER,
  API_ENDPOINTS.AUTH_REFRESH,
];

/** Nunca se reintentan (el refresh lo maneja la capa de auth). */
export const RETRY_EXCLUDED_ENDPOINTS: readonly string[] = [
  API_ENDPOINTS.AUTH_REFRESH,
];

/** Port de `HTTP_CONFIG` (backoff 1s · 2^n + jitter, 3 reintentos). */
export const HTTP_CONFIG = {
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY_MS: 1000,
  RETRY_MAX_JITTER_MS: 300,
} as const;
