import { describe, expect, it } from 'vitest';

import {
  formatMoneyInput,
  parseMoneyInput,
  parseNumberInput,
} from '@/shared/forms/numeric-input';

describe('parseMoneyInput', () => {
  it.each([
    ['', null],
    ['   ', null],
    ['abc', null],
    ['1234', 1234],
    ['1234,5', 1234.5],
    ['1.234,56', 1234.56],
    ['1.234', 1234],
    ['1.234.567', 1234567],
    ['12.5', 12.5],
    ['0,75', 0.75],
    ['$ 1.500', 1500],
    ['1,2,3', null],
    [',', null],
  ])('%j → %j', (input, expected) => {
    expect(parseMoneyInput(input)).toBe(expected);
  });
});

describe('parseNumberInput', () => {
  it('acepta enteros, negativos y decimales; nunca NaN', () => {
    expect(parseNumberInput('42')).toBe(42);
    expect(parseNumberInput('-3')).toBe(-3);
    expect(parseNumberInput('2.5')).toBe(2.5);
    expect(parseNumberInput('')).toBeNull();
    expect(parseNumberInput('1e5')).toBeNull();
    expect(parseNumberInput('NaN')).toBeNull();
  });
});

describe('formatMoneyInput', () => {
  it('formatea en es-AR y devuelve vacío para null', () => {
    expect(formatMoneyInput(1234.5)).toBe('1.234,5');
    expect(formatMoneyInput(1000)).toBe('1.000');
    expect(formatMoneyInput(null)).toBe('');
  });
});
