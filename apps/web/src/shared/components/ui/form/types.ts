import type { ReactNode } from 'react';

/** Props comunes a todos los campos del kit (label, ayuda, error, estados). */
export interface FieldBaseProps {
  readonly label: string;
  /** Id del control; si falta se genera uno estable con `useId`. */
  readonly id?: string;
  readonly name?: string;
  readonly helper?: ReactNode;
  /** Mensaje de error visible (que diga cómo arreglarlo). */
  readonly error?: string;
  /** Muestra el check de "válido" dentro del control. */
  readonly valid?: boolean;
  readonly required?: boolean;
  readonly disabled?: boolean;
  readonly className?: string;
  readonly onBlur?: () => void;
}

/** Campo controlado: `value` + `onChange(value)` tipado. */
export interface ControlledProps<T> {
  readonly value: T;
  readonly onChange: (value: T) => void;
}

/** Opción de selects, combobox y radio-cards. */
export interface FieldOption<T extends string = string> {
  readonly value: T;
  readonly label: string;
  readonly description?: string;
  readonly disabled?: boolean;
}
