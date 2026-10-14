import { asLocalDate } from '@/shared/time';
import { bucketLabel, bucketTitle } from '@/features/dashboard/helpers/flow-labels';

describe('bucketLabel (eje X)', () => {
  it('día y semana: "6 oct"', () => {
    expect(bucketLabel({ key: '2026-10-06', granularity: 'dia' })).toBe('6 oct');
    expect(bucketLabel({ key: '2026-10-05', granularity: 'semana' })).toBe('5 oct');
  });

  it('mes: abreviatura de 3 letras', () => {
    expect(bucketLabel({ key: '2026-09', granularity: 'mes' })).toBe('sep');
  });
});

describe('bucketTitle (tooltip)', () => {
  it('día: fecha larga', () => {
    expect(bucketTitle({ key: '2026-10-06', granularity: 'dia' })).toBe('martes, 6 de octubre de 2026');
  });

  it('semana: lunes a domingo', () => {
    expect(bucketTitle({ key: asLocalDate('2026-10-05'), granularity: 'semana' })).toBe('Semana del 5 oct al 11 oct');
  });

  it('mes: nombre y año', () => {
    expect(bucketTitle({ key: '2026-09', granularity: 'mes' })).toBe('septiembre 2026');
  });
});
