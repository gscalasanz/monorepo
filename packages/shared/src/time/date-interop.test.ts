import {
  businessYearOf,
  dateFromIsoString,
  dateFromMs,
  epochMsOf,
  formatInBsAs,
  instantOf,
  nowDate,
} from './index';

/** 31/12 23:30 en BsAs: en UTC ya es 1/1 del año siguiente. */
const NEW_YEAR_EVE_BSAS = '2026-12-31T23:30:00-03:00';
/** 01/01 00:30 en BsAs: en UTC son las 03:30 del mismo día. */
const NEW_YEAR_BSAS = '2027-01-01T00:30:00-03:00';

describe('nowDate', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('devuelve el instante actual como Date (para columnas timestamptz)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-13T15:00:00Z'));
    expect(nowDate().toISOString()).toBe('2026-03-13T15:00:00.000Z');
  });

  it('devuelve un Date nuevo en cada llamada (no comparte referencia)', () => {
    expect(nowDate()).not.toBe(nowDate());
  });
});

describe('dateFromMs', () => {
  it('convierte epoch ms a Date', () => {
    expect(dateFromMs(Date.parse('2026-03-13T15:00:00Z')).toISOString()).toBe(
      '2026-03-13T15:00:00.000Z',
    );
  });

  it('lanza con un valor no finito (nunca un Invalid Date silencioso)', () => {
    expect(() => dateFromMs(Number.NaN)).toThrow(/Fecha inválida/);
  });
});

describe('dateFromIsoString (mismo parseo que `new Date(string)`)', () => {
  it('`YYYY-MM-DD` es medianoche UTC (comportamiento histórico del api)', () => {
    expect(dateFromIsoString('2026-12-31').toISOString()).toBe('2026-12-31T00:00:00.000Z');
  });

  it('ISO con `Z` se respeta tal cual', () => {
    expect(dateFromIsoString('2026-12-31T23:30:00Z').toISOString()).toBe(
      '2026-12-31T23:30:00.000Z',
    );
  });

  it('ISO con offset `-03:00` se convierte al instante UTC correcto', () => {
    expect(dateFromIsoString(NEW_YEAR_EVE_BSAS).toISOString()).toBe('2027-01-01T02:30:00.000Z');
  });

  it('lanza con un string que no es fecha', () => {
    expect(() => dateFromIsoString('no-es-fecha')).toThrow(/Fecha inválida/);
  });
});

describe('epochMsOf', () => {
  it('acepta Date y string ISO y da el mismo epoch', () => {
    const iso = '2026-03-13T15:00:00.000Z';
    expect(epochMsOf(new Date(iso))).toBe(Date.parse(iso));
    expect(epochMsOf(iso)).toBe(Date.parse(iso));
  });
});

describe('instantOf', () => {
  it('convierte un Date a Instant UTC', () => {
    expect(instantOf(new Date('2026-03-13T12:00:00-03:00'))).toBe('2026-03-13T15:00:00.000Z');
  });

  it('se puede formatear en hora de BsAs', () => {
    expect(formatInBsAs(instantOf(new Date('2027-01-01T02:30:00Z')), 'yyyyMMdd-HHmmss')).toBe(
      '20261231-233000',
    );
  });
});

describe('businessYearOf', () => {
  it('fecha calendario `YYYY-MM-DD`: el año de ese día, sin pasar por zona horaria', () => {
    expect(businessYearOf('2027-01-01')).toBe(2027);
    expect(businessYearOf('2026-12-31')).toBe(2026);
  });

  it('Date de medianoche UTC (fecha calendario de un DTO): el año de ese día', () => {
    expect(businessYearOf(new Date('2027-01-01T00:00:00.000Z'))).toBe(2027);
  });

  it('31/12 23:30 BsAs (ya 1/1 en UTC) es del año que termina', () => {
    expect(businessYearOf(NEW_YEAR_EVE_BSAS)).toBe(2026);
    expect(businessYearOf(new Date(NEW_YEAR_EVE_BSAS))).toBe(2026);
  });

  it('01/01 00:30 BsAs es del año que empieza', () => {
    expect(businessYearOf(NEW_YEAR_BSAS)).toBe(2027);
  });

  it('límite del contrato: un instante en 00:00:00.000Z se lee como fecha calendario', () => {
    // 2027-01-01T00:00Z es 31/12 21:00 en BsAs, pero no se distingue de un `date` serializado.
    expect(businessYearOf(new Date('2027-01-01T00:00:00.000Z'))).toBe(2027);
    expect(businessYearOf(new Date('2027-01-01T00:00:00.001Z'))).toBe(2026);
  });

  it('lanza con un valor inválido', () => {
    expect(() => businessYearOf('no-es-fecha')).toThrow(/Fecha inválida/);
  });
});
