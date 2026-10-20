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

// EVENTO — definidos en @scout/shared
export {
  DestinoGanancia,
  EstadoCobroVenta,
  ModalidadVenta,
  TipoEvento,
} from '@scout/shared/enums';

// CAMPAMENTO — definidos en @scout/shared
export {
  EstadoPagoCampamento,
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

// ============================================================================
// EVENTOS
// ============================================================================

// ============================================================================
// FILTROS
// ============================================================================

