/**
 * Enums de la aplicación — punto de import histórico del api (`common/enums`).
 *
 * El vocabulario de dominio que cruza el cable vive en `@scout/shared/enums` y acá solo se
 * re-exporta (adaptador): así no se tocan los imports existentes y la definición es una sola.
 */

// ============================================================================
// PERSONAS — definidos en @scout/shared (única definición para api y web)
// ============================================================================

export {
  CargoEducador,
  EstadoPersona,
  PersonaType,
  Rama,
} from '@scout/shared/enums';

// INSCRIPCION — definidos en @scout/shared
export {
  EstadoInscripcion,
  TipoDeuda,
  TipoInscripcion,
} from '@scout/shared/enums';

// MOVIMIENTO — definidos en @scout/shared
export {
  CategoriaMovimiento,
  ConceptoMovimiento,
  EstadoPago,
  FiltroMovimientosCampamento,
  MedioPago,
  TipoMovimiento,
  VENTA_DERIVED_CONCEPTOS,
} from '@scout/shared/enums';

// CAJA — definidos en @scout/shared
export {
  CajaType,
} from '@scout/shared/enums';

// ============================================================================
// CAJAS Y MOVIMIENTOS
// ============================================================================

// ============================================================================
// INSCRIPCIONES
// ============================================================================

// ============================================================================
// CAMPAMENTOS
// ============================================================================

/**
 * Estado de pago de participante en campamento
 */
export enum EstadoPagoCampamento {
  PENDIENTE = 'pendiente',
  PARCIAL = 'parcial',
  PAGADO = 'pagado',
  /** Monto asignado 0: no se espera pago (típicamente educadores) */
  EXENTO = 'exento',
}

// ============================================================================
// EVENTOS
// ============================================================================

/**
 * Types of events
 * From PRD §3.4 (F10, F11): Eventos de venta y eventos de grupo
 */
export enum TipoEvento {
  VENTA = 'venta',
  GRUPO = 'grupo',
}

/**
 * Destination of event profits (for sale events)
 * From PRD §3.4 (F10): Destino de ganancia
 *
 * Lives on BOTH Evento and VentaProducto. On the evento it is the default
 * applied to new ventas; on the venta it is the value that actually decides
 * which caja receives the margen. They only differ in MIXTA events.
 */
export enum DestinoGanancia {
  CUENTAS_PERSONALES = 'cuentas_personales',
  CAJA_GRUPO = 'caja_grupo',
}

/**
 * Whether a sale event uses a single destino for every venta or lets each
 * venta pick its own.
 *
 * UNICA: every venta inherits evento.destinoGanancia. Sending a destino per
 *        venta is rejected.
 * MIXTA: each venta must declare its destino. Gastos stay event-wide and are
 *        charged entirely to the group (netoPersonal is not reduced by them).
 */
export enum ModalidadVenta {
  UNICA = 'unica',
  MIXTA = 'mixta',
}

/**
 * Whether the money for a venta has actually been collected.
 *
 * PENDIENTE covers orders taken without payment (typically via WhatsApp), so
 * they are not forgotten. It is the source of truth from which the linked
 * movimiento's EstadoPago is derived: PENDIENTE → PENDIENTE_COBRO, meaning the
 * caja balance stays untouched until the venta is marked as collected.
 */
export enum EstadoCobroVenta {
  COBRADO = 'cobrado',
  PENDIENTE = 'pendiente',
}

// ============================================================================
// FILTROS
// ============================================================================

