import {
  dateTimeInputToInstant,
  toDateInputValue,
  toDateTimeInputValue,
} from '@/shared/time';

describe('toDateInputValue (<input type="date">)', () => {
  it('deja YYYY-MM-DD tal cual', () => {
    expect(toDateInputValue('2026-03-13')).toBe('2026-03-13');
  });

  it('extrae el día de un ISO "solo fecha" sin correrlo', () => {
    expect(toDateInputValue('2026-03-13T00:00:00.000Z')).toBe('2026-03-13');
  });

  it('un timestamp toma el día de BsAs', () => {
    expect(toDateInputValue('2026-03-14T02:00:00.000Z')).toBe('2026-03-13');
  });

  it('vacío o inválido → ""', () => {
    expect(toDateInputValue('')).toBe('');
    expect(toDateInputValue(null)).toBe('');
    expect(toDateInputValue('basura')).toBe('');
  });
});

describe('toDateTimeInputValue (<input type="datetime-local">)', () => {
  it('formatea un instante en hora de BsAs', () => {
    expect(toDateTimeInputValue('2026-03-13T15:30:00.000Z')).toBe(
      '2026-03-13T12:30',
    );
  });

  it('deja YYYY-MM-DDTHH:mm tal cual', () => {
    expect(toDateTimeInputValue('2026-03-13T12:30')).toBe('2026-03-13T12:30');
  });

  it('vacío o inválido → ""', () => {
    expect(toDateTimeInputValue(undefined)).toBe('');
    expect(toDateTimeInputValue('basura')).toBe('');
  });
});

describe('dateTimeInputToInstant', () => {
  it('interpreta el valor del input como hora de BsAs', () => {
    expect(dateTimeInputToInstant('2026-03-13T12:30')).toBe(
      '2026-03-13T15:30:00.000Z',
    );
  });

  it('vacío o inválido → null', () => {
    expect(dateTimeInputToInstant('')).toBeNull();
    expect(dateTimeInputToInstant('2026-13-40T99:99')).toBeNull();
  });
});
