import { render, screen } from '@testing-library/react';

import { AppShell, PageHeader, isActivePath, isFormRoute, pageMetaFor } from '@/shared/layout';

const pathnameMock = vi.fn(() => '/movimientos');

vi.mock('next/navigation', () => ({
  usePathname: () => pathnameMock(),
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
}));

describe('nav-config', () => {
  it('isActivePath respeta los límites de segmento', () => {
    expect(isActivePath('/personas/educadores/1', '/personas')).toBe(true);
    expect(isActivePath('/personasx', '/personas')).toBe(false);
  });

  it('pageMetaFor devuelve el título de la sección (paridad Angular)', () => {
    expect(pageMetaFor('/cajas')?.title).toBe('Gestión Financiera');
    expect(pageMetaFor('/eventos/1/editar')?.title).toBe('Eventos');
    expect(pageMetaFor('/desconocida')).toBeNull();
  });

  it('isFormRoute detecta rutas de formulario', () => {
    expect(isFormRoute('/movimientos/nuevo')).toBe(true);
    expect(isFormRoute('/inscripciones/1/pago')).toBe(true);
    expect(isFormRoute('/movimientos')).toBe(false);
  });
});

describe('AppShell', () => {
  it('marca el ítem activo y oculta Reportes', () => {
    render(<AppShell>contenido</AppShell>);
    const active = screen.getAllByRole('link', { current: 'page' });
    expect(active.some((link) => link.textContent?.includes('Movimientos'))).toBe(true);
    expect(screen.queryByRole('link', { name: /Reportes/ })).not.toBeInTheDocument();
    expect(screen.getByText('contenido')).toBeInTheDocument();
  });

  it('en rutas de formulario no muestra el bottom-nav', () => {
    pathnameMock.mockReturnValue('/movimientos/nuevo');
    render(<AppShell>form</AppShell>);
    expect(screen.queryByRole('link', { name: 'Nuevo movimiento' })).not.toBeInTheDocument();
    pathnameMock.mockReturnValue('/movimientos');
  });
});

describe('PageHeader', () => {
  it('renderiza título, subtítulo, volver y acciones', () => {
    render(
      <PageHeader title="Eventos" subtitle="Organiza" backHref="/x" actions={<button>Crear</button>} />,
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Eventos' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Volver/ })).toHaveAttribute('href', '/x');
    expect(screen.getByRole('button', { name: 'Crear' })).toBeInTheDocument();
  });
});
