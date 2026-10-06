import { cajaResponseSchema, personaSchema } from '@/shared/domain';
import {
  CAJA_RESPONSE_FIXTURE,
  EDUCADOR_FIXTURE,
  PROTAGONISTA_FIXTURE,
} from '@/shared/domain/testing/fixtures';
import { cajaLabel, personaOptions } from '@/shared/queries';

describe('labels de selectores', () => {
  const base = cajaResponseSchema.parse(CAJA_RESPONSE_FIXTURE);

  it('cajaLabel usa nombre, tipo o propietario', () => {
    expect(cajaLabel({ ...base, nombre: 'Caja Chica' })).toBe('Caja Chica');
    expect(cajaLabel({ ...base, nombre: null, tipo: 'rama_manada' })).toBe('Fondo Manada');
    expect(
      cajaLabel({
        ...base,
        nombre: null,
        tipo: 'personal',
        propietario: { id: 'p', nombre: 'Ana', estado: 'activo', rama: null },
      }),
    ).toBe('Cuenta de Ana');
    expect(cajaLabel({ ...base, nombre: null, tipo: 'personal', propietario: null })).toBe('Cuenta Personal');
  });

  it('personaOptions ordena por nombre', () => {
    const a = personaSchema.parse({ ...PROTAGONISTA_FIXTURE, id: '1', nombre: 'Zoe' });
    const b = personaSchema.parse({ ...EDUCADOR_FIXTURE, id: '2', nombre: 'Ana' });
    expect(personaOptions([a, b]).map((o) => o.label)).toEqual(['Ana', 'Zoe']);
  });
});
