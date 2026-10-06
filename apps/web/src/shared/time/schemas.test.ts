import { instantSchema, localDateSchema } from '@/shared/time';

describe('localDateSchema', () => {
  it('acepta "YYYY-MM-DD" (GET de columnas date)', () => {
    expect(localDateSchema.parse('2026-01-15')).toBe('2026-01-15');
  });

  it('acepta el ISO de medianoche que devuelven POST/PATCH y lo normaliza al día', () => {
    expect(localDateSchema.parse('2026-01-15T00:00:00.000Z')).toBe('2026-01-15');
  });

  it('rechaza basura', () => {
    expect(localDateSchema.safeParse('nope').success).toBe(false);
    expect(localDateSchema.safeParse(15).success).toBe(false);
  });
});

describe('instantSchema', () => {
  it('normaliza un timestamp a ISO UTC', () => {
    expect(instantSchema.parse('2026-01-15T12:00:00-03:00')).toBe('2026-01-15T15:00:00.000Z');
  });

  it('rechaza basura', () => {
    expect(instantSchema.safeParse('nope').success).toBe(false);
  });
});
