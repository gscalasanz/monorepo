import { firstNameOf, greetingFor } from '@/features/dashboard/helpers/greeting';

describe('greetingFor', () => {
  it.each([
    [6, 'Buen día'],
    [11, 'Buen día'],
    [12, 'Buenas tardes'],
    [19, 'Buenas tardes'],
    [20, 'Buenas noches'],
    [3, 'Buenas noches'],
  ])('a las %i h → %s', (hour, expected) => {
    expect(greetingFor(hour)).toBe(expected);
  });
});

describe('firstNameOf', () => {
  it('toma solo el primer nombre', () => {
    expect(firstNameOf('Florencia Aguirre')).toBe('Florencia');
  });

  it('sin nombre devuelve vacío', () => {
    expect(firstNameOf(undefined)).toBe('');
    expect(firstNameOf('   ')).toBe('');
  });
});
