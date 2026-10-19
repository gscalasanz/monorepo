import { currentYearBsAs, nowInstant, nowMs, todayBsAs } from '@/shared/time';

const ISO_UTC = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;

describe('clock', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('nowInstant devuelve un ISO-8601 en UTC', () => {
    expect(nowInstant()).toMatch(ISO_UTC);
  });

  it('nowMs lee el reloj en milisegundos epoch', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-13T15:00:00Z'));
    expect(nowMs()).toBe(Date.parse('2026-03-13T15:00:00Z'));
  });

  it('todayBsAs devuelve el día de BsAs aunque en UTC ya sea mañana', () => {
    vi.useFakeTimers();
    // 02:00Z del 14 === 23:00 del 13 en BsAs (UTC−3).
    vi.setSystemTime(new Date('2026-03-14T02:00:00Z'));
    expect(todayBsAs()).toBe('2026-03-13');
    expect(todayBsAs()).toMatch(ISO_DAY);
  });

  it('currentYearBsAs usa el año de BsAs (año nuevo en UTC, todavía no en BsAs)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2027-01-01T01:00:00Z'));
    expect(currentYearBsAs()).toBe(2026);
  });
});
