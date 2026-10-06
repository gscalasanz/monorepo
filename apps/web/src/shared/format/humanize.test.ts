import { humanize } from '@/shared/format';

describe('humanize (port de humanize.pipe)', () => {
  it.each([
    ['scout_argentina', 'Scout Argentina'],
    ['pago_inscripcion', 'Pago Inscripcion'],
    ['some-kebab-case', 'Some Kebab Case'],
    ['ALREADY_CAPS', 'Already Caps'],
    ['mixed_Case_text', 'Mixed Case Text'],
    [
      'Pago inscripción scout_argentina 2026',
      'Pago Inscripción Scout Argentina 2026',
    ],
  ])('title: %s → %s', (value, expected) => {
    expect(humanize(value)).toBe(expected);
  });

  it('sentence: solo la primera mayúscula', () => {
    expect(humanize('SALDO_PERSONAL', 'sentence')).toBe('Saldo personal');
  });

  it('none: solo reemplaza separadores', () => {
    expect(humanize('saldo_Personal', 'none')).toBe('saldo Personal');
  });

  it('dobles separadores conservan los espacios', () => {
    expect(humanize('a__b')).toBe('A  B');
  });

  it.each([null, undefined, ''])('"" para %s', (value) => {
    expect(humanize(value)).toBe('');
  });
});
