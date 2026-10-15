import { asLocalDate } from '@/shared/time';
import { bucketKeyOf, bucketKeys } from '@/features/dashboard/helpers/flow-buckets';

const today = asLocalDate('2026-10-07'); // miércoles

describe('bucketKeyOf', () => {
  it('día: la propia fecha', () => {
    expect(bucketKeyOf({ date: today, granularity: 'dia' })).toBe('2026-10-07');
  });

  it('semana: el lunes de esa semana', () => {
    expect(bucketKeyOf({ date: today, granularity: 'semana' })).toBe('2026-10-05');
    expect(bucketKeyOf({ date: asLocalDate('2026-10-11'), granularity: 'semana' })).toBe('2026-10-05');
    expect(bucketKeyOf({ date: asLocalDate('2026-10-12'), granularity: 'semana' })).toBe('2026-10-12');
  });

  it('mes: año-mes', () => {
    expect(bucketKeyOf({ date: today, granularity: 'mes' })).toBe('2026-10');
  });
});

describe('bucketKeys', () => {
  it('días consecutivos terminando hoy', () => {
    expect(bucketKeys({ today, granularity: 'dia', count: 3 })).toEqual(['2026-10-05', '2026-10-06', '2026-10-07']);
  });

  it('semanas (lunes) terminando en la actual', () => {
    expect(bucketKeys({ today, granularity: 'semana', count: 2 })).toEqual(['2026-09-28', '2026-10-05']);
  });

  it('meses terminando en el actual', () => {
    expect(bucketKeys({ today, granularity: 'mes', count: 2 })).toEqual(['2026-09', '2026-10']);
  });

  it('cruza el cambio de mes y de año', () => {
    expect(bucketKeys({ today: asLocalDate('2026-01-02'), granularity: 'dia', count: 3 })).toEqual([
      '2025-12-31',
      '2026-01-01',
      '2026-01-02',
    ]);
  });

  it('por defecto: 30 días, 12 semanas y 12 meses', () => {
    expect(bucketKeys({ today, granularity: 'dia' })).toHaveLength(30);
    expect(bucketKeys({ today, granularity: 'semana' })).toHaveLength(12);
    expect(bucketKeys({ today, granularity: 'mes' })).toHaveLength(12);
  });
});
