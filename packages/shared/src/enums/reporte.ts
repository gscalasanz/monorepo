/**
 * Vocabulario de reportes: reporte de evento y reporte de deudas.
 * Ver docs/adr/0001-representacion-enums.md.
 */
import { Rama } from './persona';

/**
 * Variante del reporte de evento: discrimina contrato y estrategia. Se deriva de
 * (tipo, modalidadVenta, destinoGanancia):
 *   venta + mixta → VENTA_MIXTA · venta + caja_grupo → VENTA_CAJA_GRUPO
 *   venta + cuentas_personales → VENTA_CUENTAS_PERSONALES · grupo → GRUPO
 */
export const REPORTE_VARIANTE = {
  VENTA_CAJA_GRUPO: 'venta_caja_grupo',
  VENTA_CUENTAS_PERSONALES: 'venta_cuentas_personales',
  VENTA_MIXTA: 'venta_mixta',
  GRUPO: 'grupo',
} as const;
export type ReporteVariante = (typeof REPORTE_VARIANTE)[keyof typeof REPORTE_VARIANTE];

/** Severidad de una alerta del reporte de evento. */
export const REPORTE_SEVERIDAD = {
  ALTA: 'alta',
  MEDIA: 'media',
  OK: 'ok',
} as const;
export type ReporteSeveridad = (typeof REPORTE_SEVERIDAD)[keyof typeof REPORTE_SEVERIDAD];

/**
 * Grupo con el que se listan los educadores en el reporte de deudas, y valor del filtro de
 * rama para verlos aislados. No es una rama real.
 */
export const RAMA_EDUCADORES = 'Educadores';

/** Valores válidos del filtro `rama` del reporte de deudas. */
export const DEUDA_RAMA_FILTERS = [...Object.values(Rama), RAMA_EDUCADORES] as const;
export type DeudaRamaFilter = (typeof DEUDA_RAMA_FILTERS)[number];

/**
 * Tipos de deuda del reporte de deudas. DINERO unifica toda la deuda monetaria
 * (campamentos, inscripciones Scout AR y de grupo). Sin parámetro, todos los tipos.
 */
export const TipoDeudaFilter = {
  DINERO: 'dinero',
  CAMPAMENTOS: 'campamentos',
  INSCRIPCIONES_SCOUT: 'inscripcionesScout',
  INSCRIPCIONES_GRUPO: 'inscripcionesGrupo',
  DOCUMENTACION: 'documentacion',
} as const;
export type TipoDeudaFilter = (typeof TipoDeudaFilter)[keyof typeof TipoDeudaFilter];
