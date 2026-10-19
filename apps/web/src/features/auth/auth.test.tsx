import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ApiError } from '@/shared/api';
import {
  AccountProfileCard,
  AccountSecurityCard,
  LoginView,
  loginErrorMessage,
} from '@/features/auth';
import {
  changeEmailFormSchema,
  changePasswordFormSchema,
  loginFormSchema,
} from '@/features/auth/models/schemas';

const replace = vi.fn();
const loginMock = vi.fn();
const changePasswordMock = vi.fn();
const changeEmailMock = vi.fn();
const SESSION_USER = {
  id: '1',
  nombre: 'Ana Admin',
  email: 'ana@scout.com',
  tipo: 'educador',
};
let sessionUser: typeof SESSION_USER | null = SESSION_USER;

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace, push: vi.fn() }),
  usePathname: () => '/login',
}));

vi.mock('@/shared/auth', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/shared/auth')>();
  return {
    ...actual,
    login: (dto: unknown) => loginMock(dto),
    changePassword: (dto: unknown) => changePasswordMock(dto),
    changeEmail: (dto: unknown) => changeEmailMock(dto),
    useRedirectIfAuthenticated: () => ({ status: 'allowed' }),
    useSession: () => ({
      user: sessionUser,
      isAuthenticated: true,
      isLoading: false,
      initialized: true,
    }),
  };
});

function apiError(status: number, message: string): ApiError {
  return new ApiError({
    kind: 'http',
    status,
    method: 'POST',
    url: '/auth/login',
    body: { message },
  });
}

describe('schemas de auth', () => {
  it('login: email requerido/válido y contraseña mín. 6', () => {
    const result = loginFormSchema.safeParse({ email: 'x', password: '123' });
    expect(result.success).toBe(false);
    expect(
      loginFormSchema.safeParse({ email: 'a@b.com', password: '123456' })
        .success,
    ).toBe(true);
  });

  it('cambio de email exige contraseña de 8', () => {
    expect(
      changeEmailFormSchema.safeParse({
        newEmail: 'a@b.com',
        currentPassword: '1234567',
      }).success,
    ).toBe(false);
  });

  it('cambio de contraseña detecta que no coinciden', () => {
    const result = changePasswordFormSchema.safeParse({
      currentPassword: '12345678',
      newPassword: 'abcdefgh',
      confirmPassword: 'abcdefgX',
    });
    expect(result.success).toBe(false);
  });
});

describe('loginErrorMessage', () => {
  it('401 → credenciales inválidas', () => {
    expect(loginErrorMessage(apiError(401, 'Unauthorized'))).toBe(
      'Credenciales inválidas. Verifique su email y contraseña.',
    );
  });
  it('otro error → mensaje del backend o fallback', () => {
    expect(loginErrorMessage(apiError(400, 'Cuenta bloqueada'))).toBe(
      'Cuenta bloqueada',
    );
    expect(loginErrorMessage('raro')).toBe(
      'Error al iniciar sesión. Por favor, intente nuevamente.',
    );
  });
});

describe('LoginView', () => {
  beforeEach(() => {
    replace.mockReset();
    loginMock.mockReset();
    sessionStorage.clear();
  });

  it('panel institucional con copy corto: una línea y cuatro beneficios breves', async () => {
    render(<LoginView />);
    const hero = await screen.findByRole('banner');
    const items = within(hero).getAllByRole('listitem');
    expect(items).toHaveLength(4);
    items.forEach((item) =>
      expect(item.textContent?.length ?? 0).toBeLessThanOrEqual(32),
    );
    expect(
      within(hero).getByText(/finanzas del grupo/).textContent?.length ?? 0,
    ).toBeLessThanOrEqual(80);
  });

  it('valida antes de enviar', async () => {
    render(<LoginView />);
    await userEvent.click(screen.getByRole('button', { name: /Ingresar/ }));
    expect(
      await screen.findByText('El correo es requerido'),
    ).toBeInTheDocument();
    expect(loginMock).not.toHaveBeenCalled();
  });

  it('login OK vuelve a la redirectUrl guardada', async () => {
    sessionStorage.setItem('redirectUrl', '/eventos');
    loginMock.mockResolvedValue({});
    render(<LoginView />);
    await userEvent.type(
      screen.getByLabelText(/Correo electrónico/),
      'ana@scout.com',
    );
    await userEvent.type(screen.getByLabelText(/^Contraseña/), 'secreto1');
    await userEvent.click(screen.getByRole('button', { name: /Ingresar/ }));
    await waitFor(() => expect(replace).toHaveBeenCalledWith('/eventos'));
    expect(loginMock).toHaveBeenCalledWith({
      email: 'ana@scout.com',
      password: 'secreto1',
    });
  });

  it('login 401 muestra el error inline', async () => {
    loginMock.mockRejectedValue(apiError(401, 'Unauthorized'));
    render(<LoginView />);
    await userEvent.type(
      screen.getByLabelText(/Correo electrónico/),
      'ana@scout.com',
    );
    await userEvent.type(screen.getByLabelText(/^Contraseña/), 'secreto1');
    await userEvent.click(screen.getByRole('button', { name: /Ingresar/ }));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Credenciales inválidas',
    );
  });
});

describe('Mi Perfil y Seguridad', () => {
  afterEach(() => {
    sessionUser = SESSION_USER;
  });

  it('no pisa el email que el usuario ya empezó a escribir', async () => {
    sessionUser = null;
    const { rerender } = render(<AccountSecurityCard />);
    const input = screen.getByLabelText(/Nuevo email/);
    await userEvent.type(input, 'otro@scout.com');
    sessionUser = SESSION_USER;
    rerender(<AccountSecurityCard />);
    expect(screen.getByLabelText(/Nuevo email/)).toHaveValue('otro@scout.com');
  });

  it('Mi Perfil muestra nombre y tipo (sin formularios)', () => {
    render(<AccountProfileCard />);
    expect(screen.getByText('Ana Admin')).toBeInTheDocument();
    expect(screen.getByText('Educador')).toBeInTheDocument();
    expect(screen.queryByLabelText(/Nuevo email/)).not.toBeInTheDocument();
  });

  it('Seguridad agrupa email y contraseña y precarga el email actual', async () => {
    render(<AccountSecurityCard />);
    expect(
      screen.getByRole('heading', { name: 'Seguridad' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Guardar email' }),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByLabelText(/Nuevo email/)).toHaveValue('ana@scout.com'),
    );
  });

  it('contraseñas distintas no llaman al backend', async () => {
    render(<AccountSecurityCard />);
    const [current] = screen.getAllByLabelText(/Contraseña actual/).slice(-1);
    await userEvent.type(current!, '12345678');
    await userEvent.type(
      screen.getByLabelText(/^Nueva contraseña/),
      'abcdefgh',
    );
    await userEvent.type(
      screen.getByLabelText(/Confirmar nueva contraseña/),
      'abcdefgX',
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Cambiar contraseña' }),
    );
    expect(
      await screen.findByText('Las contraseñas no coinciden'),
    ).toBeInTheDocument();
    expect(changePasswordMock).not.toHaveBeenCalled();
  });

  it('cambio de contraseña OK llama al backend', async () => {
    changePasswordMock.mockResolvedValue(undefined);
    render(<AccountSecurityCard />);
    const [current] = screen.getAllByLabelText(/Contraseña actual/).slice(-1);
    await userEvent.type(current!, '12345678');
    await userEvent.type(
      screen.getByLabelText(/^Nueva contraseña/),
      'abcdefgh',
    );
    await userEvent.type(
      screen.getByLabelText(/Confirmar nueva contraseña/),
      'abcdefgh',
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Cambiar contraseña' }),
    );
    await waitFor(() =>
      expect(changePasswordMock).toHaveBeenCalledWith({
        currentPassword: '12345678',
        newPassword: 'abcdefgh',
      }),
    );
  });
});
