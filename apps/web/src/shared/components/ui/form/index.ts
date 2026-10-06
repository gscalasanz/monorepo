/**
 * `@/shared/components/ui/form` — campos de marca (DESIGN.md §Formularios).
 * Todos controlados (`value` + `onChange(value)`), accesibles (label↔control,
 * `aria-invalid`, `aria-describedby`) y con el contrato de tamaños/estados.
 */
export { ChoiceRow, type ChoiceRowProps } from './choice-row';
export { CheckboxField, type CheckboxFieldProps } from './checkbox-field';
export { ComboboxField, type ComboboxFieldProps } from './combobox-field';
export { MINUTE_STEP_SECONDS } from './constants';
export {
  ControlStatusIcon,
  type ControlStatusIconProps,
} from './control-status-icon';
export { FORM_COPY } from './copy';
export { DateField, type DateFieldProps } from './date-field';
export { DateTimeField, type DateTimeFieldProps } from './date-time-field';
export {
  DaysOfWeekField,
  type DaysOfWeekFieldProps,
} from './days-of-week-field';
export { FieldLabelText, type FieldLabelTextProps } from './field-label-text';
export { FieldMessage, type FieldMessageProps } from './field-message';
export {
  CONTROL_SIZE,
  CONTROL_SURFACE,
  type ControlSize,
} from './field-styles';
export { FormActions, type FormActionsProps } from './form-actions';
export { FormField, type FormFieldProps } from './form-field';
export { InputControl, type InputControlProps } from './input-control';
export { MoneyField, type MoneyFieldProps } from './money-field';
export { NumberField, type NumberFieldProps } from './number-field';
export { PasswordField, type PasswordFieldProps } from './password-field';
export { PasswordToggle, type PasswordToggleProps } from './password-toggle';
export { PhoneField, type PhoneFieldProps } from './phone-field';
export {
  RadioCardsField,
  type RadioCardsFieldProps,
} from './radio-cards-field';
export { SelectField, type SelectFieldProps } from './select-field';
export { SwitchField, type SwitchFieldProps } from './switch-field';
export { TextField, type TextFieldProps } from './text-field';
export { TextareaField, type TextareaFieldProps } from './textarea-field';
export { TimeField, type TimeFieldProps } from './time-field';
export type { ControlledProps, FieldBaseProps, FieldOption } from './types';
export {
  useFieldIds,
  type FieldIds,
  type FieldIdsOptions,
} from './use-field-ids';
