/** Bodies y queries de `/movimientos`. Fechas calendario como `YYYY-MM-DD`. */
import type {
  CategoriaMovimiento,
  ConceptoMovimiento,
  EstadoPago,
  MedioPago,
  TipoMovimiento,
} from '@/shared/domain/movimiento/enums';

/** `POST /movimientos` */
export interface CreateMovimientoDto {
  readonly cajaId: string;
  readonly tipo: TipoMovimiento;
  readonly monto: number;
  readonly concepto: ConceptoMovimiento;
  readonly categoria?: CategoriaMovimiento;
  readonly descripcion?: string;
  readonly responsableId: string;
  readonly medioPago: MedioPago;
  readonly requiereComprobante?: boolean;
  readonly estadoPago: EstadoPago;
  /** Obligatorio si `estadoPago` es `pendiente_reembolso`. */
  readonly personaAReembolsarId?: string;
  readonly fecha?: string;
  readonly eventoId?: string;
  readonly campamentoId?: string;
  readonly inscripcionId?: string;
}

/** `PATCH /movimientos/:id` (también edita pagos de inscripción/campamento). */
export interface UpdateMovimientoDto {
  readonly monto?: number;
  readonly descripcion?: string;
  readonly medioPago?: MedioPago;
  readonly requiereComprobante?: boolean;
  readonly comprobanteEntregado?: boolean;
  readonly estadoPago?: EstadoPago;
  readonly personaAReembolsarId?: string;
  readonly fecha?: string;
}

/** `POST /movimientos/transferencia` (crea egreso + ingreso ligados). */
export interface CreateTransferenciaDto {
  readonly cajaOrigenId: string;
  readonly cajaDestinoId: string;
  readonly monto: number;
  readonly responsableId: string;
  readonly descripcion?: string;
  readonly fecha?: string;
}

/** Query de `GET /movimientos` (+ `page`/`limit`). */
export interface MovimientosFilters {
  readonly cajaId?: string;
  /** `CajaType` separados por coma. */
  readonly tipoCaja?: string;
  readonly tipo?: TipoMovimiento;
  readonly concepto?: ConceptoMovimiento;
  readonly categoria?: CategoriaMovimiento;
  readonly responsableId?: string;
  readonly estadoPago?: EstadoPago;
  readonly fechaInicio?: string;
  readonly fechaFin?: string;
}
