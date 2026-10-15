import { initialsOf } from '@/shared/format';

describe('initialsOf', () => {
  it('toma las iniciales de las dos primeras palabras en mayúscula', () => {
    expect(initialsOf('  valentina   ríos pérez ')).toBe('VR');
  });

  it('una sola palabra → su inicial', () => {
    expect(initialsOf('Juan')).toBe('J');
  });

  it('vacío → cadena vacía', () => {
    expect(initialsOf('   ')).toBe('');
  });
});
