/**
 * Scout API Types
 * Tipos TypeScript para integración con el frontend
 * Auto-generado desde el backend
 */

// ============================================================================
// ENUMS
// ============================================================================

// Fuente única: `@scout/shared/enums` (ADR 0001). Antes era una copia a mano que había
// quedado desactualizada; se re-exporta para que la guía no vuelva a divergir.
import {
  PersonaType,
  EstadoPersona,
  Rama,
  CargoEducador,
  CajaType,
  TipoMovimiento,
  ConceptoMovimiento,
  MedioPago,
  EstadoPago,
  EstadoInscripcion,
  TipoInscripcion,
  EstadoPagoCampamento,
  TipoEvento,
  DestinoGanancia,
} from '@scout/shared/enums';

export {
  PersonaType,
  EstadoPersona,
  Rama,
  CargoEducador,
  CajaType,
  TipoMovimiento,
  ConceptoMovimiento,
  MedioPago,
  EstadoPago,
  EstadoInscripcion,
  TipoInscripcion,
  EstadoPagoCampamento,
  TipoEvento,
  DestinoGanancia,
};

// ============================================================================
// BASE ENTITY
// ============================================================================

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// ============================================================================
// PERSONAS
// ============================================================================

export interface Persona extends BaseEntity {
  nombre: string;
  estado: EstadoPersona;
  tipo: PersonaType;
}

export interface Protagonista extends Persona {
  tipo: typeof PersonaType.PROTAGONISTA;
  rama: Rama;
}

export interface Educador extends Persona {
  tipo: typeof PersonaType.EDUCADOR;
  rama: Rama | null;
  cargo: CargoEducador;
}

export interface PersonaExterna extends Persona {
  tipo: typeof PersonaType.EXTERNA;
  contacto: string | null;
  notas: string | null;
}

export type PersonaUnion = Protagonista | Educador | PersonaExterna;

// ============================================================================
// CAJAS
// ============================================================================

export interface Caja extends BaseEntity {
  tipo: CajaType;
  nombre: string | null;
  propietarioId: string | null;
  propietario?: Persona | null;
}

// ============================================================================
// MOVIMIENTOS
// ============================================================================

export interface Movimiento extends BaseEntity {
  cajaId: string;
  tipo: TipoMovimiento;
  monto: number;
  concepto: ConceptoMovimiento;
  descripcion: string | null;
  responsableId: string;
  medioPago: MedioPago;
  requiereComprobante: boolean;
  comprobanteEntregado: boolean | null;
  estadoPago: EstadoPago;
  personaAReembolsarId: string | null;
  fecha: string;
  eventoId: string | null;
  campamentoId: string | null;
  inscripcionId: string | null;
  caja?: Caja;
  responsable?: Persona;
  personaAReembolsar?: Persona | null;
}

// ============================================================================
// INSCRIPCIONES
// ============================================================================

export interface Inscripcion extends BaseEntity {
  personaId: string;
  tipo: TipoInscripcion;
  ano: number;
  montoTotal: number;
  montoBonificado: number;
  declaracionDeSalud: boolean;
  autorizacionDeImagen: boolean;
  salidasCercanas: boolean;
  autorizacionIngreso: boolean;
  persona?: Persona;
  estado?: EstadoInscripcion;
  montoPagado?: number;
}

// ============================================================================
// CAMPAMENTOS
// ============================================================================

export interface Campamento extends BaseEntity {
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  costoPorPersona: number;
  cuotasBase: number;
  descripcion: string | null;
  participantes?: Persona[];
}

// ============================================================================
// EVENTOS
// ============================================================================

export interface Evento extends BaseEntity {
  nombre: string;
  fecha: string;
  descripcion: string | null;
  tipo: TipoEvento;
  destinoGanancia: DestinoGanancia | null;
  tipoEvento: string | null;
  productos?: Producto[];
}

export interface Producto extends BaseEntity {
  eventoId: string;
  nombre: string;
  precioCosto: number;
  precioVenta: number;
  evento?: Evento;
}

export interface VentaProducto extends BaseEntity {
  eventoId: string;
  productoId: string;
  vendedorId: string;
  cantidad: number;
  evento?: Evento;
  producto?: Producto;
  vendedor?: Persona;
}

// ============================================================================
// DTOs - PERSONAS
// ============================================================================

export interface CreateProtagonistaDto {
  nombre: string;
  rama: Rama;
}

export interface CreateEducadorDto {
  nombre: string;
  rama?: Rama;
  cargo: CargoEducador;
}

export interface CreatePersonaExternaDto {
  nombre: string;
  contacto?: string;
  notas?: string;
}

export interface UpdatePersonaDto {
  nombre?: string;
  estado?: EstadoPersona;
  rama?: Rama;
  cargo?: CargoEducador;
  contacto?: string;
  notas?: string;
}

// ============================================================================
// DTOs - CAJAS
// ============================================================================

export interface CreateCajaDto {
  tipo: CajaType;
  nombre?: string;
  propietarioId?: string;
}

// ============================================================================
// DTOs - MOVIMIENTOS
// ============================================================================

export interface CreateMovimientoDto {
  cajaId: string;
  tipo: TipoMovimiento;
  monto: number;
  concepto: ConceptoMovimiento;
  descripcion?: string;
  responsableId: string;
  medioPago: MedioPago;
  requiereComprobante?: boolean;
  comprobanteEntregado?: boolean;
  estadoPago: EstadoPago;
  personaAReembolsarId?: string;
  fecha?: string;
  eventoId?: string;
  campamentoId?: string;
  inscripcionId?: string;
}

export interface UpdateMovimientoDto {
  monto?: number;
  descripcion?: string;
  medioPago?: MedioPago;
  requiereComprobante?: boolean;
  comprobanteEntregado?: boolean;
  estadoPago?: EstadoPago;
  personaAReembolsarId?: string;
  fecha?: string;
}

export interface GastoGeneralDto {
  cajaId: string;
  monto: number;
  descripcion: string;
  responsableId: string;
  medioPago: MedioPago;
  estadoPago: EstadoPago;
  personaAReembolsarId?: string;
  requiereComprobante?: boolean;
}

// ============================================================================
// DTOs - INSCRIPCIONES
// ============================================================================

export interface CreateInscripcionDto {
  personaId: string;
  tipo: TipoInscripcion;
  ano: number;
  montoTotal: number;
  montoBonificado?: number;
  declaracionDeSalud?: boolean;
  autorizacionDeImagen?: boolean;
  salidasCercanas?: boolean;
  autorizacionIngreso?: boolean;
  /** Monto pagado al crear la inscripción. Si > 0, se crea movimiento automáticamente */
  montoPagado?: number;
  /** Requerido si montoPagado > 0 */
  medioPago?: MedioPago;
}

export interface UpdateInscripcionDto {
  montoBonificado?: number;
  declaracionDeSalud?: boolean;
  autorizacionDeImagen?: boolean;
  salidasCercanas?: boolean;
  autorizacionIngreso?: boolean;
}

// ============================================================================
// DTOs - CAMPAMENTOS
// ============================================================================

export interface CreateCampamentoDto {
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  costoPorPersona: number;
  cuotasBase?: number;
  descripcion?: string;
}

export interface UpdateCampamentoDto {
  nombre?: string;
  fechaInicio?: string;
  fechaFin?: string;
  costoPorPersona?: number;
  cuotasBase?: number;
  descripcion?: string;
}

export interface AddParticipanteDto {
  personaId: string;
}

export interface PagoCampamentoDto {
  personaId: string;
  monto: number;
  medioPago: MedioPago;
}

export interface GastoCampamentoDto {
  monto: number;
  descripcion: string;
  responsableId: string;
  medioPago: MedioPago;
  estadoPago: EstadoPago;
  personaAReembolsarId?: string;
}

// ============================================================================
// DTOs - EVENTOS
// ============================================================================

export interface CreateEventoDto {
  nombre: string;
  fecha: string;
  descripcion?: string;
  tipo: TipoEvento;
  destinoGanancia?: DestinoGanancia;
  tipoEvento?: string;
}

export interface UpdateEventoDto {
  nombre?: string;
  fecha?: string;
  descripcion?: string;
  destinoGanancia?: DestinoGanancia;
  tipoEvento?: string;
}

export interface CreateProductoDto {
  eventoId: string;
  nombre: string;
  precioCosto: number;
  precioVenta: number;
}

export interface CreateVentaProductoDto {
  eventoId: string;
  productoId: string;
  vendedorId: string;
  cantidad: number;
}

export interface IngresoEventoDto {
  monto: number;
  descripcion: string;
  responsableId: string;
  medioPago: MedioPago;
}

export interface GastoEventoDto {
  monto: number;
  descripcion: string;
  responsableId: string;
  medioPago: MedioPago;
  estadoPago: EstadoPago;
  personaAReembolsarId?: string;
}

export interface CerrarEventoDto {
  medioPago: MedioPago;
}

// ============================================================================
// RESPONSE TYPES
// ============================================================================

export interface SaldoCajaResponse {
  cajaId: string;
  saldo: number;
}

export interface DarDeBajaResponse {
  saldoTransferido: number;
}

export interface ResumenFinancieroCampamento {
  campamentoId: string;
  totalEsperado: number;
  totalRecaudado: number;
  totalGastos: number;
  balance: number;
  participantes: number;
}

export interface PagoParticipante {
  personaId: string;
  nombre: string;
  montoPagado: number;
  montoEsperado: number;
  estado: EstadoPagoCampamento;
}

export interface ResumenVentasProducto {
  productoId: string;
  nombre: string;
  cantidadVendida: number;
  ingresos: number;
  costo: number;
  ganancia: number;
}

export interface ResumenVentasVendedor {
  vendedorId: string;
  nombre: string;
  cantidadVendida: number;
  ganancia: number;
}

export interface ResumenVentas {
  eventoId: string;
  totalVentas: number;
  totalCosto: number;
  gananciaTotal: number;
  ventasPorProducto: ResumenVentasProducto[];
  ventasPorVendedor: ResumenVentasVendedor[];
}

export interface ReembolsoPendiente {
  personaId: string;
  nombre: string;
  montoTotal: number;
  movimientos: Movimiento[];
}

// ============================================================================
// ERROR RESPONSE
// ============================================================================

export interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
}

// ============================================================================
// QUERY PARAMS
// ============================================================================

export interface PersonasQueryParams {
  tipo?: PersonaType;
  soloActivos?: boolean;
}

export interface CajasQueryParams {
  tipo?: CajaType;
}

export interface MovimientosQueryParams {
  cajaId?: string;
  tipo?: TipoMovimiento;
  concepto?: ConceptoMovimiento;
  responsableId?: string;
  estadoPago?: EstadoPago;
  fechaInicio?: string;
  fechaFin?: string;
}

export interface InscripcionesQueryParams {
  ano?: number;
  tipo?: TipoInscripcion;
}

