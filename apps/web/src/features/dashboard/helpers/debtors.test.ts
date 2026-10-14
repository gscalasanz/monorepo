import { PERSONA_TYPE, personaDeudaSchema, type PersonaDeuda } from '@/shared/domain';
import { buildDebtors } from '@/features/dashboard/helpers/debtors';

const SALDO_OPEN = { montoTotal: 100, montoPagado: 0, saldo: 100 };

function deuda(overrides: Partial<PersonaDeuda> & { readonly personaId: string }): PersonaDeuda {
  return personaDeudaSchema.parse({
    nombre: `Persona ${overrides.personaId}`,
    tipo: PERSONA_TYPE.PROTAGONISTA,
    estado: 'activo',
    rama: 'Unidad',
    esMayorDeEdad: false,
    deudaTotal: 0,
    campamentos: [],
    inscripcionesGrupo: [],
    inscripcionesScout: [],
    documentacionPersonal: null,
    documentacionInscripcion: [],
    ...overrides,
  });
}

const camp = { campamentoId: 'c', nombre: 'Verano', ano: 2026, autorizacionEntregada: true, ...SALDO_OPEN };
const insGrupo = { inscripcionId: 'i', tipo: 'grupo', ano: 2026, montoBonificado: 0, ...SALDO_OPEN };

describe('buildDebtors', () => {
  it('ordena de mayor a menor deuda, descarta deuda 0 y limita a 6', () => {
    const deudas = [
      deuda({ personaId: 'cero', deudaTotal: 0 }),
      ...[10, 70, 30, 90, 50, 20, 60, 40].map((n) => deuda({ personaId: `p${n}`, deudaTotal: n })),
    ];
    const { rows } = buildDebtors(deudas);
    expect(rows.map((r) => r.amount)).toEqual([90, 70, 60, 50, 40, 30]);
  });

  it('el total y la cantidad cubren a todos los deudores, no solo a los visibles', () => {
    const deudas = [10, 20, 30, 40, 50, 60, 70, 80].map((n) => deuda({ personaId: `p${n}`, deudaTotal: n }));
    const { total, count } = buildDebtors(deudas);
    expect(total).toBe(360);
    expect(count).toBe(8);
  });

  it('resume el origen de la deuda: inscripción y/o campamento con saldo abierto', () => {
    const { rows } = buildDebtors([
      deuda({ personaId: 'a', deudaTotal: 300, campamentos: [camp], inscripcionesGrupo: [insGrupo] }),
      deuda({ personaId: 'b', deudaTotal: 200, campamentos: [camp] }),
      deuda({ personaId: 'c', deudaTotal: 100, inscripcionesScout: [insGrupo] }),
    ]);
    expect(rows.map((r) => r.concepts)).toEqual([
      ['inscripcion', 'campamento'],
      ['campamento'],
      ['inscripcion'],
    ]);
  });

  it('ignora conceptos ya saldados', () => {
    const saldado = { ...camp, saldo: 0 };
    const { rows } = buildDebtors([deuda({ personaId: 'a', deudaTotal: 50, campamentos: [saldado] })]);
    expect(rows[0]?.concepts).toEqual([]);
  });

  it('conserva nombre, rama e id; incluye educadores', () => {
    const { rows } = buildDebtors([
      deuda({ personaId: 'edu', nombre: 'Ana Gómez', tipo: PERSONA_TYPE.EDUCADOR, rama: 'Educadores', deudaTotal: 5 }),
    ]);
    expect(rows[0]).toMatchObject({ id: 'edu', nombre: 'Ana Gómez', rama: 'Educadores' });
  });

  it('cada deudor lleva a la ficha de su tipo de persona', () => {
    const { rows } = buildDebtors([
      deuda({ personaId: 'p1', deudaTotal: 30 }),
      deuda({ personaId: 'e1', tipo: PERSONA_TYPE.EDUCADOR, rama: 'Educadores', deudaTotal: 20 }),
    ]);
    expect(rows.map((r) => r.href)).toEqual(['/personas/protagonistas/p1', '/personas/educadores/e1']);
  });

  it('sin deudas → vacío', () => {
    expect(buildDebtors([])).toEqual({ rows: [], count: 0, total: 0 });
  });
});
