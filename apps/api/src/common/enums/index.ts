/**
 * Enums de la aplicación — punto de import histórico del api (`common/enums`).
 *
 * El vocabulario de dominio que cruza el cable vive en `@scout/shared/enums` y acá solo se
 * re-exporta (adaptador): así no se tocan los imports existentes y la definición es una sola.
 * Ver docs/adr/0001-representacion-enums.md.
 */
export {
  CajaType,
  CargoEducador,
  CategoriaMovimiento,
  ConceptoMovimiento,
  DestinoGanancia,
  EstadoCobroVenta,
  EstadoInscripcion,
  EstadoPago,
  EstadoPagoCampamento,
  EstadoPersona,
  FiltroMovimientosCampamento,
  MedioPago,
  ModalidadVenta,
  PersonaType,
  Rama,
  TipoDeuda,
  TipoEvento,
  TipoInscripcion,
  TipoMovimiento,
  VENTA_DERIVED_CONCEPTOS,
} from '@scout/shared/enums';
