import { calculateDurationInMinutes, formatDuration } from '@/shared/time';

describe('calculateDurationInMinutes', () => {
  it('calcula minutos entre dos horas HH:mm', () => {
    expect(calculateDurationInMinutes({ start: '09:00', end: '10:30' })).toBe(90);
  });

  it('si el fin es anterior al inicio asume que cruza la medianoche', () => {
    expect(calculateDurationInMinutes({ start: '23:00', end: '01:00' })).toBe(120);
  });
});

describe('formatDuration', () => {
  it.each([
    [90, '1h 30m'],
    [120, '2h'],
    [45, '45m'],
    [0, '0m'],
  ])('%i min → %s', (minutes, expected) => {
    expect(formatDuration(minutes)).toBe(expected);
  });
});
