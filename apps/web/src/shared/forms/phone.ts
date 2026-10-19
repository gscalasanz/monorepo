/**
 * Máscara de teléfono argentino (port de `phone-mask.util.ts` +
 * `phone-normalizer.util.ts` de Angular): `(11) 1234-5678`, máximo 10 dígitos
 * nacionales. Se descarta el `0` de larga distancia inicial y, si se pega un
 * número internacional (`+54 9 11 …`), el código de país `54` y el `9` de celular.
 */
export const PHONE_NATIONAL_DIGITS = 10;
export const AR_COUNTRY_PREFIX = '+54';

const AREA_CODE_END = 2;
const FIRST_PART_END = 6;
const NON_DIGITS = /\D/g;
const LEADING_ZEROS = /^0+/;
const AR_COUNTRY_CODE = '54';
const AR_MOBILE_PREFIX = '9';

/** Formato en que el campo entrega el valor: E.164 (`+541112345678`) o dígitos. */
export type PhoneValueFormat = 'E164' | 'digits';

function stripPrefixIfTooLong(digits: string, prefix: string): string {
  return digits.length > PHONE_NATIONAL_DIGITS && digits.startsWith(prefix)
    ? digits.slice(prefix.length)
    : digits;
}

/**
 * Dígitos nacionales (sin `0` inicial, sin prefijo de país, máx. 10). Como
 * `normalizePhoneToE164` de Angular: el `54` (y el `9` de celular) solo se
 * quitan si sobran dígitos, así un número nacional de 10 dígitos queda intacto.
 */
export function phoneDigits(input: string): string {
  const raw = input.replace(NON_DIGITS, '').replace(LEADING_ZEROS, '');
  const withoutCountry = stripPrefixIfTooLong(raw, AR_COUNTRY_CODE);
  const withoutMobile = stripPrefixIfTooLong(withoutCountry, AR_MOBILE_PREFIX);
  return withoutMobile.replace(LEADING_ZEROS, '').slice(0, PHONE_NATIONAL_DIGITS);
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
