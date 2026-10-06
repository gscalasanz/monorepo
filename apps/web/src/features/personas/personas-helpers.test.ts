import { personasSchema, type Persona } from '@/shared/domain';
import {
  AGRUPACION_FIXTURE,
  EDUCADOR_FIXTURE,
  EXTERNO_FIXTURE,
  PROTAGONISTA_FIXTURE,
} from '@/shared/domain/testing/fixtures';
import { PERSONA_ROUTES } from '@/features/personas/constants/personas';
import {
  conceptoLabel,
  docItems,
  groupMovimientosByMonth,
  paidRatio,
  saldoTone,
} from '@/features/personas/helpers/ficha';
import {
  createEducadorDto,
  externaDto,
  updateEducadorDto,
} from '@/features/personas/helpers/forms';
import {
  buildStats,
  docKeysForTab,
  docValue,
  filterPersonas,
  splitByTipo,
  withEstado,
  withoutPersona,
} from '@/features/personas/helpers/list';
import { entityNameOf, initialsOf } from '@/features/personas/helpers/persona';
import { personaDashboardSchema } from '@/features/personas/models/dashboard-schema';
import {
  credencialesErrors,
  educadorFormSchema,
  protagonistaFormSchema,
} from '@/features/personas/models/form-schemas';

const PERSONAS: Persona[] = personasSchema.parse([
  PROTAGONISTA_FIXTURE,
  {
    ...PROTAGONISTA_FIXTURE,
    id: 'p-rov',
    nombre: 'Rocío Rover',
    rama: 'Rovers',
  },
  {
    ...PROTAGONISTA_FIXTURE,
    id: 'p-off',
    nombre: 'Julián Off',
    estado: 'inactivo',
  },
  EDUCADOR_FIXTURE,
  EXTERNO_FIXTURE,
  AGRUPACION_FIXTURE,
]);

const groups = splitByTipo(PERSONAS);

describe('listado de personas', () => {
  it('separa por tipo y descarta la agrupación', () => {
    expect(groups.protagonistas).toHaveLength(3);
    expect(groups.educadores).toHaveLength(1);
    expect(groups.externas).toHaveLength(1);
  });

  it('filtra por tab de rama, oculta deshabilitados y busca case-insensitive', () => {
    const base = { tab: 'manada' as const, search: '', showDisabled: false };
    expect(filterPersonas({ groups, filter: base }).map((p) => p.id)).toEqual([
      'per-1',
    ]);
    expect(
      filterPersonas({ groups, filter: { ...base, showDisabled: true } }),
    ).toHaveLength(2);
    expect(
      filterPersonas({
        groups,
        filter: { ...base, showDisabled: true, search: 'JULI' },
      }),
    ).toHaveLength(1);
    expect(
      filterPersonas({ groups, filter: { ...base, tab: 'rovers' } }).map(
        (p) => p.nombre,
      ),
    ).toEqual(['Rocío Rover']);
    expect(
      filterPersonas({ groups, filter: { ...base, tab: 'educadores' } }),
    ).toHaveLength(1);
    expect(
      filterPersonas({ groups, filter: { ...base, tab: 'externos' } }),
    ).toHaveLength(0);
  });

  it('stats respetan el toggle salvo "Total Activos" (rareza de Angular)', () => {
    expect(buildStats({ groups, showDisabled: false })).toEqual({
      protagonistas: 2,
      educadores: 1,
      externas: 0,
      activos: 3,
    });
    expect(buildStats({ groups, showDisabled: true })).toMatchObject({
      protagonistas: 3,
      externas: 1,
      activos: 3,
    });
  });

  it('columnas de documentación por tab', () => {
    expect(docKeysForTab('educadores')).toEqual([]);
    expect(docKeysForTab('rovers')).not.toContain('dniPadres');
    expect(docKeysForTab('manada')).toHaveLength(4);
    expect(docKeysForTab('externos')).toHaveLength(4);
  });

  it('documentación: no protagonistas siempre en false', () => {
    const [juan] = groups.protagonistas;
    const [laura] = groups.educadores;
    if (!juan || !laura) throw new Error('fixtures');
    expect(docValue({ persona: juan, key: 'dni' })).toBe(true);
    expect(docValue({ persona: laura, key: 'dni' })).toBe(false);
  });

  it('actualizaciones locales inmutables', () => {
    const next = withEstado({
      personas: PERSONAS,
      id: 'per-1',
      estado: 'inactivo',
    });
    expect(next.find((p) => p.id === 'per-1')?.estado).toBe('inactivo');
    expect(PERSONAS.find((p) => p.id === 'per-1')?.estado).toBe('activo');
    expect(withoutPersona({ personas: PERSONAS, id: 'per-1' })).toHaveLength(
      PERSONAS.length - 1,
    );
  });
});

describe('identidad y rutas', () => {
  it('iniciales y nombre de entidad para confirmDelete', () => {
    expect(initialsOf('  valentina   ríos pérez ')).toBe('VR');
    expect(initialsOf('Juan')).toBe('J');
    expect(entityNameOf('externo')).toBe('persona externa');
  });

  it('rutas por tipo', () => {
    expect(PERSONA_ROUTES.detail({ tipo: 'educador', id: 'x' })).toBe(
      '/personas/educadores/x',
    );
    expect(PERSONA_ROUTES.edit({ tipo: 'externo', id: 'x' })).toBe(
      '/personas/personas-externas/x/editar',
    );
    expect(PERSONA_ROUTES.create('protagonista')).toBe(
      '/personas/protagonistas/crear',
    );
  });
});

const DASHBOARD = personaDashboardSchema.parse({
  persona: {
    id: 'per-1',
    nombre: 'Juan',
    tipo: 'protagonista',
    estado: 'activo',
    rama: 'Rovers',
  },
  cuentaPersonal: { id: 'c1', saldo: '1500.00' },
  documentacionPersonal: {
    partidaNacimiento: true,
    dni: false,
    dniPadres: true,
    carnetObraSocial: true,
    completa: false,
  },
  inscripciones: { resumen: { total: 0, cantidad: 0 }, items: [] },
  campamentos: { resumen: { total: 0, cantidad: 0 }, items: [] },
  deudaTotal: { total: 0, inscripciones: 0, campamentos: 0 },
  ultimosMovimientos: [
    {
      id: 'm1',
      fecha: '2026-10-02T15:00:00.000Z',
      tipo: 'ingreso',
      concepto: 'inscripcion_grupo',
      monto: 24000,
      medioPago: 'transferencia',
    },
    {
      id: 'm2',
      fecha: '2026-10-01T15:00:00.000Z',
      tipo: 'egreso',
      concepto: 'Compra de lona',
      monto: '500',
      medioPago: 'efectivo',
    },
    {
      id: 'm3',
      fecha: '2026-09-12T15:00:00.000Z',
      tipo: 'egreso',
      concepto: 'campamento_pago',
      monto: 100,
      medioPago: 'saldo_personal',
    },
  ],
});

describe('ficha de persona', () => {
  it('el schema normaliza decimales y cargo ausente o null', () => {
    expect(DASHBOARD.cuentaPersonal.saldo).toBe(1500);
    expect(DASHBOARD.persona.cargo).toBeNull();
    const educadorSinCargo = personaDashboardSchema.safeParse({
      ...DASHBOARD,
      cuentaPersonal: { id: 'c1', saldo: '0.00' },
      persona: { ...DASHBOARD.persona, tipo: 'educador', cargo: null },
    });
    expect(educadorSinCargo.success).toBe(true);
  });

  it('tono del saldo', () => {
    expect([saldoTone(10), saldoTone(-1), saldoTone(0)]).toEqual([
      'positive',
      'negative',
      'zero',
    ]);
  });

  it('documentación: Rovers sin DNI Padres', () => {
    if (!DASHBOARD.documentacionPersonal) throw new Error('fixture');
    const items = docItems({
      documentacion: DASHBOARD.documentacionPersonal,
      rama: 'Rovers',
    });
    expect(items.map((i) => i.label)).toEqual([
      'Partida de Nacimiento',
      'DNI',
      'Carnet Obra Social',
    ]);
    expect(
      docItems({
        documentacion: DASHBOARD.documentacionPersonal,
        rama: 'Manada',
      }),
    ).toHaveLength(4);
  });

  it('progreso de pago acotado', () => {
    expect(paidRatio({ pagado: 50, total: 200 })).toBe(0.25);
    expect(paidRatio({ pagado: 500, total: 200 })).toBe(1);
    expect(paidRatio({ pagado: 0, total: 0 })).toBe(1);
  });

  it('concepto: label si es enum, texto libre si no', () => {
    expect(conceptoLabel('inscripcion_grupo')).toBe('Inscripción de Grupo');
    expect(conceptoLabel('Compra de lona')).toBe('Compra de lona');
  });

  it('movimientos agrupados por mes con signo y detalle', () => {
    const grouped = groupMovimientosByMonth(DASHBOARD.ultimosMovimientos);
    expect(grouped.map((g) => g.label)).toEqual([
      'Octubre 2026',
      'Septiembre 2026',
    ]);
    expect(grouped[0]?.rows.map((r) => r.amount)).toEqual([24000, -500]);
    expect(grouped[0]?.rows[0]?.detail).toBe('2 oct 2026 · Transferencia');
  });
});

describe('formularios', () => {
  it('protagonista: nombre 2–100, safeText y rama requerida', () => {
    const result = protagonistaFormSchema.safeParse({
      nombre: 'J',
      rama: null,
      partidaNacimiento: false,
      dni: false,
      dniPadres: false,
      carnetObraSocial: false,
    });
    expect(result.success).toBe(false);
    const messages = result.success
      ? []
      : result.error.issues.map((i) => i.message);
    expect(messages).toEqual([
      'El nombre es requerido (mínimo 2 caracteres)',
      'La rama es requerida',
    ]);
    expect(
      protagonistaFormSchema.shape.nombre.safeParse('Juan <b>').success,
    ).toBe(false);
  });

  it('educador: email válido, password ≥8 (MinLength del backend) y credenciales vinculadas', () => {
    expect(educadorFormSchema.shape.email.safeParse('mal').success).toBe(false);
    expect(educadorFormSchema.shape.password.safeParse('1234567').success).toBe(
      false,
    );
    expect(educadorFormSchema.shape.password.safeParse('12345678').success).toBe(
      true,
    );
    expect(credencialesErrors({ email: 'a@b.com', password: '' })).toEqual({
      password: 'La contraseña es requerida si ingresás email',
    });
    expect(credencialesErrors({ email: '', password: '123456' })).toEqual({
      email: 'El email es requerido si ingresás contraseña',
    });
    expect(credencialesErrors({ email: '', password: '' })).toEqual({});
  });

  it('DTOs: vacíos → undefined, edición de educador sin credenciales', () => {
    const parsed = educadorFormSchema.parse({
      nombre: 'Laura',
      rama: null,
      cargo: 'Educador',
      email: '',
      password: '',
    });
    expect(createEducadorDto(parsed)).toEqual({
      nombre: 'Laura',
      rama: undefined,
      cargo: 'Educador',
      email: undefined,
      password: undefined,
    });
    expect(updateEducadorDto(parsed)).not.toHaveProperty('email');
    expect(externaDto({ nombre: 'Ana', contacto: '', notas: 'x' })).toEqual({
      nombre: 'Ana',
      contacto: undefined,
      notas: 'x',
    });
  });
});
