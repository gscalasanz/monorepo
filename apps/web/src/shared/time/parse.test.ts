import {
  addDays,
  asInstant,
  asLocalDate,
  calculateWeekRange,
  daysBetween,
  isBefore,
  isLocalDateString,
  localDateOf,
  msFromInstant,
  msToInstant,
  parseInstant,
  parseLocalDate,
  resolveBackendDate,
} from '@/shared/time';

describe('isLocalDateString', () => {
  it.each(['2026-03-13', '2000-01-01'])('acepta %s', (value) => {
    expect(isLocalDateString(value)).toBe(true);
  });

  it.each([
    '2026-3-13',
    '13/03/2026',
    '2026-03-13T00:00:00Z',
    '',
    '2026-02-30',
  ])('rechaza %s', (value) => {
    expect(isLocalDateString(value)).toBe(false);
  });
});

describe('parseLocalDate', () => {
  it('acepta YYYY-MM-DD tal cual', () => {
    expect(parseLocalDate('2026-03-13')).toBe('2026-03-13');
  });

  it('extrae el día de un ISO "solo fecha" (medianoche Z) sin correrlo por la zona', () => {
    expect(parseLocalDate('2026-03-13T00:00:00.000Z')).toBe('2026-03-13');
    expect(parseLocalDate('2026-03-13T00:00:00Z')).toBe('2026-03-13');
  });

  it('para un instante real usa el día de BsAs', () => {
    expect(parseLocalDate('2026-03-14T02:00:00Z')).toBe('2026-03-13');
  });

  it('lanza ante un valor inválido (fail fast)', () => {
    expect(() => parseLocalDate('nope')).toThrow();
  });
});

describe('parseInstant', () => {
  it('normaliza a ISO UTC', () => {
    expect(parseInstant('2026-03-13T12:00:00-03:00')).toBe(
      '2026-03-13T15:00:00.000Z',
    );
  });

  it('lanza ante un valor inválido', () => {
    expect(() => parseInstant('nope')).toThrow();
  });
});

describe('resolveBackendDate', () => {
  it('una fecha calendario se ancla a la medianoche de BsAs', () => {
    expect(resolveBackendDate('2026-03-13')).toBe('2026-03-13T03:00:00.000Z');
  });

  it('un ISO "solo fecha" (T00:00:00.000Z) se trata como fecha calendario', () => {
    expect(resolveBackendDate('2026-03-13T00:00:00.000Z')).toBe(
      '2026-03-13T03:00:00.000Z',
    );
  });

  it('un timestamp se respeta como instante', () => {
    expect(resolveBackendDate('2026-03-13T15:30:00.000Z')).toBe(
      '2026-03-13T15:30:00.000Z',
    );
  });

  it('acepta DD/MM/YYYY y DD/MM/YYYY HH:mm como hora de BsAs (como el pipe de Angular)', () => {
    expect(resolveBackendDate('13/03/2026')).toBe('2026-03-13T03:00:00.000Z');
    expect(resolveBackendDate('13/03/2026 10:30')).toBe(
      '2026-03-13T13:30:00.000Z',
    );
  });

  it('acepta milisegundos epoch', () => {
    expect(resolveBackendDate(Date.parse('2026-03-13T15:30:00Z'))).toBe(
      '2026-03-13T15:30:00.000Z',
    );
  });

  it.each([null, undefined, '', 'nope', Number.NaN, {}])(
    'devuelve null para %s',
    (value) => {
      expect(resolveBackendDate(value)).toBeNull();
    },
  );
});

describe('localDateOf', () => {
  it('21:00 BsAs (00:00Z del día siguiente) no salta de día', () => {
    expect(localDateOf(asInstant('2026-06-30T00:00:00Z'))).toBe('2026-06-29');
  });

  it('lanza ante un instante inválido', () => {
    expect(() => localDateOf(asInstant('nope'))).toThrow();
  });
});

describe('aritmética de fechas', () => {
  it('addDays suma y resta días calendario', () => {
    expect(addDays(asLocalDate('2026-02-28'), 1)).toBe('2026-03-01');
    expect(addDays(asLocalDate('2026-03-01'), -1)).toBe('2026-02-28');
  });

  it('daysBetween cuenta días calendario (negativo si `to` es anterior)', () => {
    expect(
      daysBetween({
        from: asLocalDate('2026-03-13'),
        to: asLocalDate('2026-03-20'),
      }),
    ).toBe(7);
    expect(
      daysBetween({
        from: asLocalDate('2026-03-20'),
        to: asLocalDate('2026-03-13'),
      }),
    ).toBe(-7);
  });

  it('isBefore compara instantes reales', () => {
    expect(
      isBefore(
        asInstant('2026-03-13T00:00:00Z'),
        asInstant('2026-03-13T00:00:01Z'),
      ),
    ).toBe(true);
    expect(
      isBefore(
        asInstant('2026-03-13T00:00:01Z'),
        asInstant('2026-03-13T00:00:00Z'),
      ),
    ).toBe(false);
  });

  it('msFromInstant y msToInstant son inversas', () => {
    const instant = asInstant('2026-03-13T15:30:00.000Z');
    expect(msToInstant(msFromInstant(instant))).toBe(instant);
  });
});

describe('calculateWeekRange', () => {
  it('devuelve lunes y domingo de la semana', () => {
    expect(calculateWeekRange(asLocalDate('2026-03-13'))).toEqual({
      startDate: '2026-03-09',
      endDate: '2026-03-15',
    });
  });

  it('un domingo pertenece a la semana que empezó el lunes anterior', () => {
    expect(calculateWeekRange(asLocalDate('2026-03-15'))).toEqual({
      startDate: '2026-03-09',
      endDate: '2026-03-15',
    });
  });

  it('un lunes empieza su propia semana', () => {
    expect(calculateWeekRange(asLocalDate('2026-03-09'))).toEqual({
      startDate: '2026-03-09',
      endDate: '2026-03-15',
    });
  });
});
