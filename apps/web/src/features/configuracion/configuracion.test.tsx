import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ConfiguracionView, downloadBlob } from '@/features/configuracion';

const fetchXlsxExport = vi.fn();
const fetchSqlBackup = vi.fn();
vi.mock('@/features/configuracion/services/backups-api', () => ({
  fetchXlsxExport: () => fetchXlsxExport(),
  fetchSqlBackup: () => fetchSqlBackup(),
}));

const notifyMock = vi.hoisted(() => ({
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn(),
}));
vi.mock('@/shared/notifications', () => ({ notify: notifyMock }));

describe('downloadBlob', () => {
  it('crea un link temporal y revoca la URL', () => {
    const create = vi.fn(() => 'blob:x');
    const revoke = vi.fn();
    vi.stubGlobal('URL', {
      ...URL,
      createObjectURL: create,
      revokeObjectURL: revoke,
    });
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => undefined);
    downloadBlob(new Blob(['abc']), 'scout-export.xlsx');
    expect(create).toHaveBeenCalled();
    expect(click).toHaveBeenCalled();
    expect(revoke).toHaveBeenCalledWith('blob:x');
    vi.unstubAllGlobals();
  });

  it('un blob vacío es un error', () => {
    expect(() => downloadBlob(new Blob([]), 'x')).toThrow();
  });
});

describe('ConfiguracionView', () => {
  beforeEach(() => {
    localStorage.clear();
    Object.values(notifyMock).forEach((fn) => fn.mockReset());
  });

  it('carga y guarda los montos de inscripción en localStorage', async () => {
    localStorage.setItem(
      'scout_inscripcion_config',
      JSON.stringify({ montoScoutArgentina: 1500, montoGrupo: 800 }),
    );
    render(
      <ConfiguracionView profileSlot={<p>perfil</p>} securitySlot={null} />,
    );
    expect(
      screen.getByRole('heading', { level: 1, name: 'Configuración' }),
    ).toBeInTheDocument();
    const grupo = screen.getByLabelText(/Monto Inscripción de Grupo/);
    await waitFor(() => expect(grupo).toHaveValue('800'));
    await userEvent.clear(grupo);
    await userEvent.type(grupo, '900');
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(
      JSON.parse(localStorage.getItem('scout_inscripcion_config') ?? '{}'),
    ).toEqual({
      montoScoutArgentina: 1500,
      montoGrupo: 900,
    });
    expect(notifyMock.success).toHaveBeenCalledWith(
      'Configuración guardada exitosamente',
    );
  });

  it('índice lateral con links a cada sección', () => {
    render(
      <ConfiguracionView
        profileSlot={<p>perfil</p>}
        securitySlot={<p>seguridad</p>}
      />,
    );
    const index = screen.getByRole('navigation', {
      name: 'Secciones de configuración',
    });
    expect(within(index).getByRole('link', { name: 'Perfil' })).toHaveAttribute(
      'href',
      '#perfil',
    );
    expect(
      within(index).getByRole('link', { name: 'Seguridad' }),
    ).toHaveAttribute('href', '#seguridad');
    expect(within(index).getByRole('link', { name: 'Backup' })).toHaveAttribute(
      'href',
      '#backup',
    );
    expect(
      within(index).getByRole('link', { name: 'Inscripciones' }),
    ).toHaveAttribute('href', '#inscripciones');
    expect(document.getElementById('seguridad')).toHaveTextContent('seguridad');
  });

  it('error de descarga muestra el mensaje de Angular', async () => {
    fetchXlsxExport.mockRejectedValue(new Error('500'));
    render(<ConfiguracionView profileSlot={null} securitySlot={null} />);
    await userEvent.click(
      screen.getByRole('button', { name: /Exportar a Excel/ }),
    );
    await waitFor(() =>
      expect(notifyMock.error).toHaveBeenCalledWith(
        'Error al exportar a Excel',
      ),
    );
  });
});
