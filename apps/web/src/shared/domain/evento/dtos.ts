/** Bodies de `/eventos`. */
import type {
  DestinoGanancia,
  EstadoCobroVenta,
  ModalidadVenta,
  TipoEvento,
} from '@/shared/domain/evento/enums';
import type { EstadoPago, MedioPago } from '@/shared/domain/movimiento';

/** `POST /eventos` */
export interface CreateEventoDto {
  readonly nombre: string;
  /** `YYYY-MM-DD` */
  readonly fecha: string;
  readonly descripcion?: string;
  readonly tipo: TipoEvento;
  /** Obligatorio si tipo === venta. */
  readonly destinoGanancia?: DestinoGanancia;
  /** Default `unica`. */
  readonly modalidadVenta?: ModalidadVenta;
  /** Máx 50. Solo tipo === grupo. */
  readonly tipoEvento?: string;
}

/** `PATCH /eventos/:eventoId` */
export interface UpdateEventoDto extends Partial<CreateEventoDto> {
  readonly reportePublico?: boolean;
}

/** `POST /eventos/:eventoId/productos` (precioCosto opcional: se carga después). */
export interface CreateProductoDto {
  readonly nombre: string;
  readonly precioVenta: number;
  readonly precioCosto?: number;
}

/** `PATCH /eventos/productos/:productoId` (sin eventoId en la ruta). */
export type UpdateProductoDto = Partial<CreateProductoDto>;

export interface VentaItemDto {
  readonly productoId: string;
  readonly cantidad: number;
}

/** `POST /eventos/:eventoId/ventas/lote` */
export interface RegisterVentasLoteDto {
  /** Puede ser una agrupación ("Grupo Scout") cuando vendió el grupo. */
  readonly vendedorId: string;
  readonly medioPago: MedioPago;
  readonly items: readonly VentaItemDto[];
  /** Quién responde por la plata. Default: el vendedor. */
  readonly responsableId?: string;
  /** Obligatorio si el evento es mixta; prohibido si es unica. */
  readonly destinoGanancia?: DestinoGanancia;
  /** Default cobrado. */
  readonly estadoCobro?: EstadoCobroVenta;
  /** Crea la entrega junto con la venta (stock pendiente 0). */
  readonly entregaInmediata?: boolean;
}

/** `POST /eventos/:eventoId/ingresos` (solo eventos de grupo). */
export interface RegistrarIngresoEventoDto {
  readonly monto: number;
  readonly descripcion: string;
  readonly responsableId: string;
  readonly medioPago: MedioPago;
}

/** `POST /eventos/:eventoId/gastos` */
export interface RegistrarGastoEventoDto extends RegistrarIngresoEventoDto {
  readonly estadoPago: EstadoPago;
  /** Obligatorio si estadoPago === pendiente_reembolso. */
  readonly personaAReembolsarId?: string;
}
