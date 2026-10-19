/**
 * `@/shared/forms` — kit de formularios (port de mi-tienda): validación on-blur
 * con zod, mapa de errores, estado inmutable del form y parsers de inputs.
 */
export { collectFieldErrors } from './field-errors';
export type { SaveResult } from './save-result';
export {
  useFieldValidation,
  type FieldValidation,
} from './use-field-validation';
export { useFormState, type FormState } from './use-form-state';
export {
  useNumericDraft,
  type NumericDraft,
  type NumericDraftOptions,
} from './use-numeric-draft';
export {
  formatMoneyInput,
  parseMoneyInput,
  parseNumberInput,
  sanitizeMoneyInput,
} from './numeric-input';
export {
  AR_COUNTRY_PREFIX,
  PHONE_NATIONAL_DIGITS,
  maskPhone,
  phoneDigits,
  phoneDisplayFromValue,
  phoneValueFromInput,
  type PhoneValueFormat,
} from './phone';
export { toggleDay } from './days-of-week';
