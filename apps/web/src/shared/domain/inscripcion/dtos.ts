/** Bodies y queries de `/inscripciones`. */
import type {
  INSCRIPCIONES_RAMA_EDUCADOR,
  TipoDeuda,
  TipoInscripcion,
} from '@/shared/domain/inscripcion/enums';
import type { MedioPago } from '@/shared/domain/movimiento';
import type { Rama } from '@/shared/domain/persona';

/** `POST /inscripciones` (puede incluir el primer pago, mixto con saldo personal). */
export interface CreateInscripcionDto {
  readonly personaId: string;
  readonly tipo: TipoInscripcion;
  readonly ano: number;
  readonly montoTotal: number;
  readonly montoPagado?: number;
  readonly montoConSaldoPersonal?: number;
  readonly medioPago?: MedioPago;
  readonly montoBonificado?: number;
  readonly declaracionDeSalud?: boolean;
  readonly autorizacionDeImagen?: boolean;
  readonly salidasCercanas?: boolean;
  readonly autorizacionIngreso?: boolean;
  readonly certificadoAptitudFisica?: boolean;
}

/** `PATCH /inscripciones/:id` (solo documentación). */
export interface UpdateInscripcionDto {
  readonly declaracionDeSalud?: boolean;
  readonly autorizacionDeImagen?: boolean;
  readonly salidasCercanas?: boolean;
  readonly autorizacionIngreso?: boolean;
  readonly certificadoAptitudFisica?: boolean;
}

/** `PATCH /inscripciones/:id/bonificacion` (fondo solidario) — también la usan campamentos. */
export interface BonificarDto {
  readonly monto: number;
}

/** `POST /inscripciones/:id/pagar` */
export interface PagoInscripcionDto {
  readonly montoPagado: number;
  readonly montoConSaldoPersonal?: number;
  readonly medioPago?: MedioPago;
  readonly descripcion?: string;
}

/** Query de `GET /inscripciones` y `/consolidado`. No mandar `deudores` (400). */
export interface InscripcionesQuery {
  readonly ano?: number;
  readonly tipo?: TipoInscripcion;
  readonly tipoDeuda?: TipoDeuda;
  readonly rama?: Rama | typeof INSCRIPCIONES_RAMA_EDUCADOR;
}
