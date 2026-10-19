export {
  ESTADO_INSCRIPCION,
  ESTADO_INSCRIPCION_LABELS,
  INSCRIPCIONES_RAMA_EDUCADOR,
  TIPO_DEUDA,
  TIPO_INSCRIPCION,
  TIPO_INSCRIPCION_LABELS,
  type EstadoInscripcion,
  type TipoDeuda,
  type TipoInscripcion,
} from './enums';
export {
  estadoInscripcionSchema,
  inscripcionesConsolidadoSchema,
  inscripcionesSchema,
  inscripcionSchema,
  movimientoInscripcionSchema,
  tipoDeudaSchema,
  tipoInscripcionSchema,
  type DistribucionPorRama,
  type Inscripcion,
  type InscripcionesConsolidado,
  type MovimientoInscripcion,
} from './schemas';
export type {
  BonificarDto,
  CreateInscripcionDto,
  InscripcionesQuery,
  PagoInscripcionDto,
  UpdateInscripcionDto,
} from './dtos';
