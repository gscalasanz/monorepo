/** Un validador devuelve el mensaje de error o `null` si el valor es válido. */
export type ValidationResult = string | null;
export type Validator<T> = (value: T) => ValidationResult;
