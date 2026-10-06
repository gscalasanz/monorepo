/**
 * Máscara de teléfono argentino (port de `phone-mask.util.ts` +
 * `phone-normalizer.util.ts` de Angular): `(11) 1234-5678`, máximo 10 dígitos
 * nacionales. Se descarta el `0` de larga distancia inicial.
 */
export const PHONE_NATIONAL_DIGITS = 10;
export const AR_COUNTRY_PREFIX = '+54';

const AREA_CODE_END = 2;
const FIRST_PART_END = 6;
const NON_DIGITS = /\D/g;
const LEADING_ZEROS = /^0+/;

/** Formato en que el campo entrega el valor: E.164 (`+541112345678`) o dígitos. */
export type PhoneValueFormat = 'E164' | 'digits';

/** Dígitos nacionales (sin `0` inicial, sin prefijo de país, máx. 10). */
export function phoneDigits(input: string): string {
  return input
    .replace(NON_DIGITS, '')
    .replace(LEADING_ZEROS, '')
    .slice(0, PHONE_NATIONAL_DIGITS);
}

/** Aplica la máscara `(AA) BBBB-CCCC` a medida que se tipea. */
export function maskPhone(input: string): string {
  const digits = phoneDigits(input);
  if (!digits) return '';
  const area = digits.slice(0, AREA_CODE_END);
  if (digits.length <= AREA_CODE_END) return `(${area}`;
  const first = digits.slice(AREA_CODE_END, FIRST_PART_END);
  if (digits.length <= FIRST_PART_END) return `(${area}) ${first}`;
  return `(${area}) ${first}-${digits.slice(FIRST_PART_END)}`;
}

/** Valor que se entrega al form a partir de lo tipeado. `''` si no hay dígitos. */
export function phoneValueFromInput(options: {
  readonly input: string;
  readonly format: PhoneValueFormat;
}): string {
  const digits = phoneDigits(options.input);
  if (!digits) return '';
  return options.format === 'E164' ? `${AR_COUNTRY_PREFIX}${digits}` : digits;
}

/** Texto enmascarado a mostrar a partir del valor guardado (E.164 o dígitos). */
export function phoneDisplayFromValue(value: string): string {
  const national = value.startsWith(AR_COUNTRY_PREFIX)
    ? value.slice(AR_COUNTRY_PREFIX.length)
    : value;
  return maskPhone(national);
}
