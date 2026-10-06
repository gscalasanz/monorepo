/**
 * `@/shared/validators` — validadores puros (`valor → mensaje | null`) portados de
 * Angular, adaptables a zod con `refineWith`. Mensajes en `VALIDATION_MESSAGES`.
 */
export { VALIDATION_MESSAGES } from './messages';
export type { ValidationResult, Validator } from './types';
export {
  decimalPlaces,
  maxAmount,
  positiveNumber,
  ramaValida,
  safeText,
} from './field-validators';
export {
  bonificacionDisponible,
  comprobanteEntregado,
  credencialesCompletas,
  dateRange,
  fechasCampamento,
  saldoSuficiente,
  type BonificacionValue,
  type ComprobanteValue,
  type CredencialesValue,
  type DateRangeValue,
  type FechasCampamentoValue,
  type SaldoValue,
} from './form-validators';
export {
  personaAReembolsarOnEstadoChange,
  personaAReembolsarOnResponsableChange,
  personaAReembolsarRequerida,
  type EstadoChange,
  type ReembolsoValue,
  type ResponsableChange,
} from './persona-reembolso';
export { refineWith, type RefineOptions } from './zod';
