import { formatMoney } from '@/shared/format';

/** Intl es-AR usa espacio no separable (U+00A0) entre `$` y el número. */
describe('formatMoney (port de money.pipe.spec.ts)', () => {
  it('miles con punto (es-AR)', () => {
    expect(formatMoney(1234567)).toBe('$ 1.234.567');
    expect(formatMoney(1000)).toBe('$ 1.000');
  });

  it('cero es "$ 0" (cero no es vacío)', () => {
    expect(formatMoney(0)).toBe('$ 0');
  });

  it('redondea con 0 decimales (default)', () => {
    expect(formatMoney(1234.56)).toBe('$ 1.235');
  });

  it('2 decimales a pedido', () => {
    expect(formatMoney(1234.5, { decimals: 2 })).toBe('$ 1.234,50');
  });

  it('negativos', () => {
    expect(formatMoney(-1500)).toBe('-$ 1.500');
  });

  it.each([null, undefined, Number.NaN])('"-" para %s', (value) => {
    expect(formatMoney(value)).toBe('-');
  });

  it('placeholder propio', () => {
    expect(formatMoney(null, { placeholder: '—' })).toBe('—');
  });
});
