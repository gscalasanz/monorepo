import { asInstant, DATE_FORMATS, formatDate, formatInBsAs } from '@/shared/time';

describe('formatDate (paridad con el pipe dateFormat de Angular)', () => {
  it('date: dd/MM/yyyy', () => {
    expect(formatDate('2026-03-13T15:30:00.000Z')).toBe('13/03/2026');
  });

  it('una fecha calendario no se corre al día anterior (bug clásico UTC−3)', () => {
    expect(formatDate('2026-03-13')).toBe('13/03/2026');
    expect(formatDate('2026-03-13T00:00:00.000Z')).toBe('13/03/2026');
  });

  it('time: HH:mm en 24 h, en hora de BsAs', () => {
    expect(formatDate('2026-03-13T15:30:00.000Z', DATE_FORMATS.time)).toBe('12:30');
  });

  it('datetime: dd/MM/yyyy, HH:mm (como Intl es-AR)', () => {
    expect(formatDate('2026-03-13T15:30:00.000Z', DATE_FORMATS.dateTime)).toBe(
      '13/03/2026, 12:30',
    );
  });

  it('datelong: día de la semana y mes en castellano', () => {
    expect(formatDate('2026-03-13', DATE_FORMATS.dateLong)).toBe('viernes, 13 de marzo de 2026');
  });

  it('formatos de los templates de Angular (`| date:...`)', () => {
    const value = '2026-03-13T15:30:00.000Z';
    expect(formatDate(value, DATE_FORMATS.dateTimeCompact)).toBe('13/03/2026 12:30');
    expect(formatDate(value, DATE_FORMATS.dayMonthNumeric)).toBe('13/3');
    expect(formatDate(value, DATE_FORMATS.longDate)).toBe('13 de marzo de 2026');
    expect(formatDate(value, DATE_FORMATS.dayMonth)).toBe('13 mar');
    expect(formatDate(value, DATE_FORMATS.dayMonthYear)).toBe('13 mar 2026');
  });

  it.each([null, undefined, '', 'basura'])('devuelve "" para %s', (value) => {
    expect(formatDate(value)).toBe('');
  });
});

describe('formatInBsAs', () => {
  it('formatea un Instant con un patrón de date-fns en la zona de BsAs', () => {
    expect(formatInBsAs(asInstant('2026-06-30T00:00:00Z'), 'yyyy-MM-dd HH:mm')).toBe(
      '2026-06-29 21:00',
    );
  });
});
