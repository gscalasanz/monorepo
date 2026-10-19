/** Mensajes de validación (español rioplatense), centralizados. */
export const VALIDATION_MESSAGES = {
  REQUIRED: 'Este campo es obligatorio',
  MIN_LENGTH: (min: number): string => `Debe tener al menos ${min} caracteres`,
  MAX_LENGTH: (max: number): string => `No puede exceder ${max} caracteres`,
  EMAIL: 'Ingrese un email válido',
  PHONE: 'Ingrese un teléfono válido',
  /** Copy de los templates de Angular (`positiveNumber`). */
  POSITIVE_NUMBER: 'Debe ser un número positivo',
  INVALID_DECIMAL: 'Ingrese un número válido',
  MAX_DECIMALS: (max: number): string => `Máximo ${max} decimales`,
  UNSAFE_TEXT: 'No se permiten los caracteres < > " \' ; & | `',
  INVALID_RAMA: 'Rama inválida',
  INVALID_DATE_RANGE: 'La fecha de fin no puede ser anterior a la de inicio',
  FECHAS_CAMPAMENTO: 'La fecha de fin debe ser posterior a la fecha de inicio',
  CREDENCIALES_INCOMPLETAS:
    'Email y contraseña van juntos: completá ambos o ninguno',
  MAX_AMOUNT: (max: number): string => `El monto no puede superar ${max}`,
  BONIFICACION_NO_DISPONIBLE:
    'Ya existe una inscripción bonificada para este año',
  COMPROBANTE_PENDIENTE:
    'El comprobante es requerido pero no ha sido entregado',
  SALDO_INSUFICIENTE: (saldo: number): string =>
    `Saldo insuficiente. Disponible: $${saldo}`,
  PERSONA_A_REEMBOLSAR: 'Indicá a quién hay que reembolsarle',
  DATE_FUTURE: 'La fecha no puede ser en el pasado',
  DATE_PAST: 'La fecha no puede ser en el futuro',
} as const;
