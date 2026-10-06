import { describe, expect, it } from 'vitest';

import {
  maskPhone,
  phoneDisplayFromValue,
  phoneValueFromInput,
} from '@/shared/forms/phone';

describe('maskPhone (formato AR de Angular)', () => {
  it.each([
    ['', ''],
    ['1', '(1'],
    ['11', '(11'],
    ['113', '(11) 3'],
    ['111234', '(11) 1234'],
    ['1112345', '(11) 1234-5'],
    ['1112345678', '(11) 1234-5678'],
    ['111234567899', '(11) 1234-5678'],
    ['(11) 1234-5678', '(11) 1234-5678'],
    ['01112345678', '(11) 1234-5678'],
  ])('%s → %s', (input, expected) => {
    expect(maskPhone(input)).toBe(expected);
  });
});

describe('phoneValueFromInput / phoneDisplayFromValue', () => {
  it('entrega E.164 por defecto y dígitos si se pide', () => {
    expect(
      phoneValueFromInput({ input: '(11) 1234-5678', format: 'E164' }),
    ).toBe('+541112345678');
    expect(
      phoneValueFromInput({ input: '(11) 1234-5678', format: 'digits' }),
    ).toBe('1112345678');
    expect(phoneValueFromInput({ input: '()', format: 'E164' })).toBe('');
  });

  it('muestra enmascarado tanto E.164 como dígitos', () => {
    expect(phoneDisplayFromValue('+541112345678')).toBe('(11) 1234-5678');
    expect(phoneDisplayFromValue('1112345678')).toBe('(11) 1234-5678');
    expect(phoneDisplayFromValue('')).toBe('');
  });
});
