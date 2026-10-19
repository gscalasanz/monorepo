import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  countDocsFaltantes,
  docGroups,
  debtCards,
  hasDocDeuda,
  personalDocItems,
  summarize,
  toDeudaFilters,
} from '@/features/reportes/helpers/deudas';
import { ESTADO_PERSONA, PERSONA_TYPE } from '@/shared/domain';
import { isPlaceholderReport } from '@/features/reportes/constants/copy';
import { yearOptions } from '@/features/reportes/constants/filters';
import type { ConsolidadoDeudas } from '@/features/reportes/models/consolidado';
import type { PersonaDeuda } from '@/features/reportes/models/deudas';
import {
  isInscripcionSelected,
  toggleInscripcion,
  withoutTipo,
} from '@/features/reportes/helpers/origen';
import { DeudasView, PlaceholderReportView } from '@/features/reportes';

const mocks = vi.hoisted(() => ({
  fetchDeudas: vi.fn(),
  fetchConsolidado: vi.fn(),
}));
vi.mock('@/features/reportes/services/reportes-api', () => mocks);

const DOCS_OK = {
  dni: true,
  partidaNacimiento: true,
  dniPadres: true,
  carnetObraSocial: true,
};

function persona(overrides: Partial<PersonaDeuda> = {}): PersonaDeuda {
  return {
    personaId: 'p1',
    nombre: 'Ana Pérez',
    tipo: PERSONA_TYPE.PROTAGONISTA,
    estado: ESTADO_PERSONA.ACTIVO,
    rama: 'Manada',
    esMayorDeEdad: false,
    deudaTotal: 0,
    campamentos: [],
    inscripcionesGrupo: [],
    inscripcionesScout: [],
    documentacionPersonal: DOCS_OK,
    documentacionInscripcion: [],
    ...overrides,
  };
}

const camp = (ano: number, saldo: number, autorizacionEntregada = true) => ({
  campamentoId: `c${ano}`,
  nombre: `Camp ${ano}`,
  ano,
  montoTotal: saldo,
  montoPagado: 0,
  saldo,
  autorizacionEntregada,
});
const insc = (
  ano: number,
  saldo: number,
  extra: { montoBonificado?: number; montoPagado?: number } = {},
) => ({
  inscripcionId: `i${ano}`,
  tipo: 'x',
  ano,
  montoTotal: saldo + (extra.montoBonificado ?? 0) + (extra.montoPagado ?? 0),
  montoBonificado: extra.montoBonificado ?? 0,
  montoPagado: extra.montoPagado ?? 0,
  saldo,
});
const docInsc = {
  inscripcionId: 'i1',
  ano: 2026,
  declaracionDeSalud: false,
  autorizacionDeImagen: true,
  salidasCercanas: false,
  autorizacionIngreso: true,
  certificadoAptitudFisica: true,
};

describe('helpers de deudas (paridad ReporteDeudasComponent)', () => {
  it('debtCards: solo saldo > 0, ordenadas por año y etiqueta', () => {
    const p = persona({
      campamentos: [camp(2026, 500), camp(2025, 0)],
      inscripcionesScout: [insc(2025, 100)],
      inscripcionesGrupo: [insc(2026, 200)],
    });
    expect(debtCards(p).map((c) => `${c.label} ${c.ano}`)).toEqual([
      'Scout AR 2025',
      'Camp. 2026',
      'Grupo 2026',
    ]);
  });

  it('debtCards: lo que había que pagar (sin bonificación) y lo pagado', () => {
    const [card] = debtCards(
      persona({
        inscripcionesScout: [
          insc(2026, 600, { montoBonificado: 100, montoPagado: 300 }),
        ],
      }),
    );
    expect(card).toMatchObject({ aPagar: 900, pagado: 300, saldo: 600 });
  });

  it('docGroups: personal, una por inscripción y autorizaciones de campamento', () => {
    const groups = docGroups(
      persona({
        documentacionPersonal: { ...DOCS_OK, dni: false },
        documentacionInscripcion: [docInsc],
        campamentos: [camp(2026, 0, false)],
      }),
    );
    expect(groups.map((g) => g.title)).toEqual([
      'Personal',
      'Inscripción 2026',
      'Autorizaciones de campamento',
    ]);
    expect(groups[0]?.items.find((i) => i.label === 'DNI')?.ok).toBe(false);
    expect(groups[2]?.items).toEqual([{ ok: false, label: 'Camp 2026 2026' }]);
  });

  it('personalDocItems: sin doc → []; mayor de edad sin "DNI padres"', () => {
    expect(personalDocItems(persona({ documentacionPersonal: null }))).toEqual(
      [],
    );
    expect(
      personalDocItems(persona({ esMayorDeEdad: true })).map((d) => d.label),
    ).toEqual(['DNI', 'Partida nac.', 'Obra social']);
    expect(personalDocItems(persona())).toHaveLength(4);
  });

  it('hasDocDeuda y countDocsFaltantes cuentan personales + inscripción + autorizaciones', () => {
    const ok = persona();
    expect(hasDocDeuda(ok)).toBe(false);
    const p = persona({
      documentacionPersonal: { ...DOCS_OK, dni: false },
      documentacionInscripcion: [docInsc],
      campamentos: [camp(2026, 0, false)],
    });
    expect(hasDocDeuda(p)).toBe(true);
    expect(countDocsFaltantes(p)).toBe(1 + 2 + 1);
    expect(hasDocDeuda(persona({ campamentos: [camp(2026, 0, false)] }))).toBe(
      true,
    );
  });

  it('summarize y toDeudaFilters', () => {
    const list = [
      persona({ deudaTotal: 300 }),
      persona({
        personaId: 'p2',
        deudaTotal: 200,
        documentacionInscripcion: [docInsc],
      }),
    ];
    expect(summarize(list)).toEqual({
      personas: 2,
      totalDeuda: 500,
      docsFaltantes: 1,
    });
    expect(toDeudaFilters({ rama: 'Manada', ano: '2025', tipo: '' })).toEqual({
      rama: 'Manada',
      ano: 2025,
    });
    expect(toDeudaFilters({ rama: 'Otra', tipo: 'documentacion' })).toEqual({
      tipo: 'documentacion',
    });
    expect(toDeudaFilters({})).toEqual({});
  });

  it('toDeudaFilters: búsqueda recortada y campamento elegido', () => {
    expect(toDeudaFilters({ q: '  ana ' }, 'camp-1')).toEqual({
      q: 'ana',
      campamentoId: 'camp-1',
    });
    expect(toDeudaFilters({ q: '   ' })).toEqual({});
  });

  it('origen: elegir una inscripción setea tipo + año, y volver a elegirla los quita', () => {
    const item = { tipo: 'inscripcionesGrupo', ano: 2026, deudaTotal: 1, personasConDeuda: 1 } as const;
    const elegido = toggleInscripcion({ rama: 'Manada' }, item);
    expect(elegido).toEqual({ rama: 'Manada', tipo: 'inscripcionesGrupo', ano: '2026' });
    expect(isInscripcionSelected(elegido, item)).toBe(true);
    expect(toggleInscripcion(elegido, item)).toEqual({ rama: 'Manada' });
    expect(withoutTipo(elegido)).toEqual({ rama: 'Manada', ano: '2026' });
  });

  it('yearOptions del año actual hasta 2020 y guard de placeholders', () => {
    expect(yearOptions(2022).map((o) => o.value)).toEqual([
      '2022',
      '2021',
      '2020',
    ]);
    expect(isPlaceholderReport('caja')).toBe(true);
    expect(isPlaceholderReport('toString')).toBe(false);
  });
});

const CONSOLIDADO: ConsolidadoDeudas = {
  personasConDeuda: 3,
  deudaTotal: 62000,
  deudaCampamentos: 52000,
  deudaInscripcionesScout: 0,
  deudaInscripcionesGrupo: 10000,
  campamentos: [
    { campamentoId: 'camp-inicio', nombre: 'Campamento de Inicio', ano: 2026, deudaTotal: 52000, personasConDeuda: 2 },
  ],
  inscripciones: [
    { tipo: 'inscripcionesGrupo', ano: 2026, deudaTotal: 10000, personasConDeuda: 1 },
  ],
};

describe('<DeudasView>', () => {
  beforeEach(() => {
    mocks.fetchDeudas.mockReset();
    mocks.fetchConsolidado.mockReset();
    mocks.fetchConsolidado.mockResolvedValue(CONSOLIDADO);
  });

  it('consolidado del backend: elegir un campamento filtra el listado y se puede quitar', async () => {
    mocks.fetchDeudas.mockResolvedValue([persona({ deudaTotal: 500 })]);
    render(<DeudasView />);
    const boton = await screen.findByRole('button', {
      name: /Campamento de Inicio 2026/,
    });
    expect(boton).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(boton);
    await waitFor(() =>
      expect(mocks.fetchDeudas).toHaveBeenLastCalledWith(
        { campamentoId: 'camp-inicio' },
        expect.anything(),
      ),
    );
    expect(
      screen.getByRole('button', { name: /Campamento de Inicio 2026/ }),
    ).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(screen.getByRole('button', { name: 'Quitar filtro' }));
    await waitFor(() =>
      expect(mocks.fetchDeudas).toHaveBeenLastCalledWith({}, expect.anything()),
    );
  });

  it('elegir una inscripción filtra por tipo + año', async () => {
    mocks.fetchDeudas.mockResolvedValue([persona({ deudaTotal: 500 })]);
    render(<DeudasView />);
    await userEvent.click(
      await screen.findByRole('button', { name: /Inscripciones Grupo 2026/ }),
    );
    await waitFor(() =>
      expect(mocks.fetchDeudas).toHaveBeenLastCalledWith(
        { tipo: 'inscripcionesGrupo', ano: 2026 },
        expect.anything(),
      ),
    );
  });

  it('escribir en el buscador consulta al backend con q', async () => {
    mocks.fetchDeudas.mockResolvedValue([persona({ deudaTotal: 500 })]);
    render(<DeudasView />);
    await userEvent.type(
      await screen.findByRole('searchbox', { name: 'Buscar persona' }),
      'ana',
    );
    await waitFor(() =>
      expect(mocks.fetchDeudas).toHaveBeenLastCalledWith(
        { q: 'ana' },
        expect.anything(),
      ),
    );
  });

  it('KPIs, tabla con nombre y chevron a la ficha, chips neutros y filas expandibles', async () => {
    mocks.fetchDeudas.mockResolvedValue([
      persona({ deudaTotal: 500, campamentos: [camp(2026, 500, false)] }),
      persona({
        personaId: 'p2',
        nombre: 'Beto Gómez',
        deudaTotal: 0,
        documentacionInscripcion: [docInsc],
      }),
    ]);
    render(<DeudasView />);
    expect(await screen.findByLabelText('Resumen de deudas')).toHaveTextContent(
      'Personas con deuda2',
    );
    const table = screen.getByRole('region', { name: 'Personas con deuda' });
    expect(
      within(table).getByRole('link', { name: 'Ana Pérez' }),
    ).toHaveAttribute('href', '/personas/protagonistas/p1');
    expect(
      within(table).getByRole('link', { name: 'Ver ficha de Ana Pérez' }),
    ).toHaveAttribute('href', '/personas/protagonistas/p1');
    const chip = within(table).getByText('2 docs');
    expect(chip.className).not.toMatch(/warning|danger/);
    expect(
      within(table).getByText('Camp. 2026').closest('span')?.className,
    ).not.toMatch(/danger/);
    await userEvent.click(
      screen.getByRole('button', { name: 'Ver detalle de Ana Pérez' }),
    );
    const deudas = screen.getByRole('list', {
      name: 'Deudas monetarias de Ana Pérez',
    });
    expect(
      within(deudas).getByText('Campamento Camp 2026'),
    ).toBeInTheDocument();
    expect(within(deudas).getByText(/Pagó/)).toHaveTextContent(
      /Pagó \$\s?0 de \$\s?500/,
    );
    expect(
      screen.getByText('Autorizaciones de campamento'),
    ).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole('button', { name: 'Ver detalle de Beto Gómez' }),
    );
    expect(screen.getByText('Inscripción 2026')).toBeInTheDocument();
    expect(screen.getAllByText('Decl. salud').length).toBeGreaterThan(0);
  });

  it('vacío y error con reintento', async () => {
    mocks.fetchDeudas
      .mockRejectedValueOnce(new Error('boom'))
      .mockResolvedValueOnce([]);
    render(<DeudasView />);
    expect(
      await screen.findByText(/Error al cargar el reporte/),
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }));
    await waitFor(() =>
      expect(
        screen.getByText(
          'No hay deudas pendientes con los filtros seleccionados',
        ),
      ).toBeInTheDocument(),
    );
  });
});

describe('<PlaceholderReportView>', () => {
  it('replica título y texto de Angular', () => {
    render(<PlaceholderReportView report="caja" />);
    expect(screen.getByText('Reporte de Caja')).toBeInTheDocument();
    expect(
      screen.getByText('Reporte de movimientos de caja'),
    ).toBeInTheDocument();
  });
});
