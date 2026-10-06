import {
  CARGO_EDUCADOR,
  ESTADO_PERSONA,
  ESTADO_PERSONA_LABELS,
  PERSONA_TYPE,
  PERSONA_TYPE_LABELS,
  RAMA,
  RAMA_TAB_KEYS,
  RAMAS,
  isPersonaDisabled,
  isRamaTabKey,
  onlyEnabled,
  personaSchema,
  personasSchema,
  ramaFromTabKey,
} from '@/shared/domain';
import {
  AGRUPACION_FIXTURE,
  EDUCADOR_FIXTURE,
  EXTERNO_FIXTURE,
  PROTAGONISTA_FIXTURE,
} from '@/shared/domain/testing/fixtures';

describe('enums de persona', () => {
  it('el tipo externo se llama "externo" (no "externa") como en el backend', () => {
    expect(PERSONA_TYPE.EXTERNA).toBe('externo');
    expect(PERSONA_TYPE_LABELS.externo).toBe('Persona Externa');
  });

  it('inactivo se muestra como Deshabilitado', () => {
    expect(ESTADO_PERSONA_LABELS[ESTADO_PERSONA.INACTIVO]).toBe(
      'Deshabilitado',
    );
  });

  it('ramas capitalizadas y en orden', () => {
    expect(RAMAS).toEqual(['Manada', 'Unidad', 'Caminantes', 'Rovers']);
    expect(CARGO_EDUCADOR.JEFE_DE_RAMA).toBe('Jefe de Rama');
  });

  it('tab keys de rama ida y vuelta', () => {
    expect(RAMA_TAB_KEYS[RAMA.CAMINANTES]).toBe('caminantes');
    expect(isRamaTabKey('rovers')).toBe(true);
    expect(isRamaTabKey('educadores')).toBe(false);
    expect(ramaFromTabKey('manada')).toBe('Manada');
    expect(ramaFromTabKey('otra')).toBeUndefined();
  });
});

describe('personaSchema (STI discriminada por tipo)', () => {
  it('parsea las cuatro variantes', () => {
    const personas = personasSchema.parse([
      PROTAGONISTA_FIXTURE,
      EDUCADOR_FIXTURE,
      EXTERNO_FIXTURE,
      AGRUPACION_FIXTURE,
    ]);
    expect(personas.map((p) => p.tipo)).toEqual([
      'protagonista',
      'educador',
      'externo',
      'agrupacion',
    ]);
  });

  it('estrecha por tipo', () => {
    const persona = personaSchema.parse(PROTAGONISTA_FIXTURE);
    if (persona.tipo !== PERSONA_TYPE.PROTAGONISTA)
      throw new Error('tipo inesperado');
    expect(persona.rama).toBe('Manada');
    expect(persona.dniPadres).toBe(false);
  });

  it('descarta campos que no son del contrato (p. ej. passwordHash filtrado por el POST)', () => {
    const persona = personaSchema.parse({
      ...EDUCADOR_FIXTURE,
      passwordHash: 'x',
    });
    expect(persona).not.toHaveProperty('passwordHash');
  });

  it('rechaza una rama inválida', () => {
    expect(
      personaSchema.safeParse({ ...PROTAGONISTA_FIXTURE, rama: 'manada' })
        .success,
    ).toBe(false);
  });
});

describe('personas deshabilitadas (port de persona-estado.util.spec.ts)', () => {
  const activa = { id: 'a', estado: ESTADO_PERSONA.ACTIVO };
  const deshabilitada = { id: 'd', estado: ESTADO_PERSONA.INACTIVO };
  const sinEstado: { id: string; estado?: 'activo' | 'inactivo' } = { id: 's' };

  it('solo el estado inactivo cuenta como deshabilitado', () => {
    expect(isPersonaDisabled(activa)).toBe(false);
    expect(isPersonaDisabled(deshabilitada)).toBe(true);
    expect(isPersonaDisabled(sinEstado)).toBe(false);
  });

  it('onlyEnabled descarta deshabilitados sin mutar la lista', () => {
    const personas = [activa, deshabilitada, sinEstado];
    expect(onlyEnabled(personas)).toEqual([activa, sinEstado]);
    expect(personas).toHaveLength(3);
  });
});
