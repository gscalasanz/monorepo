import { fireEvent, render, screen } from '@testing-library/react';

import {
  BackLink,
  markHistoryPop,
  canGoBackInApp,
  recordNavigation,
  resetNavigationHistory,
} from '@/shared/navigation';

const nav = vi.hoisted(() => ({ back: vi.fn(), push: vi.fn() }));

vi.mock('next/navigation', () => ({
  useRouter: () => nav,
}));

beforeEach(() => {
  resetNavigationHistory();
  nav.back.mockClear();
  nav.push.mockClear();
});

describe('historial interno', () => {
  it('no hay a dónde volver en la primera página', () => {
    recordNavigation('/reportes/deudas');
    expect(canGoBackInApp()).toBe(false);
  });

  it('suma al navegar, ignora la misma ruta repetida y resta con "atrás" del navegador', () => {
    recordNavigation('/reportes/deudas');
    recordNavigation('/reportes/deudas');
    recordNavigation('/personas/educadores/1');
    expect(canGoBackInApp()).toBe(true);
    markHistoryPop();
    recordNavigation('/reportes/deudas');
    expect(canGoBackInApp()).toBe(false);
  });
});

describe('BackLink', () => {
  const renderLink = () =>
    render(<BackLink fallbackHref="/personas">Volver</BackLink>);

  it('vuelve a la página anterior (no a una URL fija) si hay historial interno', () => {
    recordNavigation('/reportes/deudas');
    recordNavigation('/personas/educadores/1');
    renderLink();
    fireEvent.click(screen.getByRole('link', { name: 'Volver' }));
    expect(nav.back).toHaveBeenCalledOnce();
    expect(nav.push).not.toHaveBeenCalled();
  });

  it('cae al href de respaldo cuando la página se abrió directo', () => {
    recordNavigation('/personas/educadores/1');
    renderLink();
    fireEvent.click(screen.getByRole('link', { name: 'Volver' }));
    expect(nav.push).toHaveBeenCalledWith('/personas');
    expect(nav.back).not.toHaveBeenCalled();
  });

  it('respeta ctrl/cmd-click (abrir en pestaña nueva)', () => {
    recordNavigation('/a');
    recordNavigation('/b');
    renderLink();
    fireEvent.click(screen.getByRole('link', { name: 'Volver' }), { ctrlKey: true });
    expect(nav.back).not.toHaveBeenCalled();
  });
});
