import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  ConfirmDialogHost,
  confirmDialog,
  confirmStore,
  errorHintFor,
  settleConfirm,
} from '@/shared/confirm';

describe('confirmDialog', () => {
  afterEach(() => {
    confirmStore.setState({ active: null, busy: false });
  });

  it('modo simple: confirmar resuelve true', async () => {
    render(<ConfirmDialogHost />);
    let result: Promise<boolean> = Promise.resolve(false);
    act(() => {
      result = confirmDialog.confirm({ title: 'Título', message: '¿Seguro?' });
    });
    await userEvent.click(
      await screen.findByRole('button', { name: 'Confirmar' }),
    );
    await expect(result).resolves.toBe(true);
  });

  it('modo simple: cancelar resuelve false', async () => {
    render(<ConfirmDialogHost />);
    let result: Promise<boolean> = Promise.resolve(true);
    act(() => {
      result = confirmDialog.confirmDelete('campamento');
    });
    expect(
      await screen.findByText(/eliminar este campamento/),
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    await expect(result).resolves.toBe(false);
  });

  it('modo async: la acción falla y muestra el mensaje + pista', async () => {
    render(<ConfirmDialogHost />);
    const action = vi
      .fn()
      .mockRejectedValue(new Error('Tiene 2 movimiento(s) asociado(s)'));
    act(() => {
      void confirmDialog.runDelete('inscripción', { action });
    });
    await userEvent.click(
      await screen.findByRole('button', { name: 'Eliminar' }),
    );
    expect(
      await screen.findByText(/movimiento\(s\) asociado\(s\)/),
    ).toBeInTheDocument();
    expect(screen.getByText(/Primero debes eliminar/)).toBeInTheDocument();
  });

  it('modo async: la acción OK muestra éxito y resuelve confirmed', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    render(<ConfirmDialogHost />);
    let result: Promise<{ confirmed: boolean }> = Promise.resolve({
      confirmed: false,
    });
    act(() => {
      result = confirmDialog.run({
        title: 'Procesar',
        message: '¿Procesar?',
        entityName: 'pago',
        action: () => Promise.resolve(),
      });
    });
    await userEvent.click(
      await screen.findByRole('button', { name: 'Confirmar' }),
    );
    expect(
      await screen.findByText('Pago procesado exitosamente.'),
    ).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(1300);
    });
    await waitFor(() => expect(result).resolves.toEqual({ confirmed: true }));
    vi.useRealTimers();
  });

  it('modo async: cerrar (Esc) durante el éxito resuelve confirmed true', async () => {
    render(<ConfirmDialogHost />);
    let result: Promise<{ confirmed: boolean }> = Promise.resolve({
      confirmed: false,
    });
    act(() => {
      result = confirmDialog.run({
        title: 'Procesar',
        message: '¿Procesar?',
        entityName: 'pago',
        action: () => Promise.resolve(),
      });
    });
    await userEvent.click(
      await screen.findByRole('button', { name: 'Confirmar' }),
    );
    expect(
      await screen.findByText('Pago procesado exitosamente.'),
    ).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    await expect(result).resolves.toEqual({ confirmed: true });
  });

  it('un open() mientras la acción corre no pisa al diálogo activo', async () => {
    render(<ConfirmDialogHost />);
    let release: () => void = () => undefined;
    const action = () =>
      new Promise<void>((resolve) => {
        release = resolve;
      });
    let first: Promise<{ confirmed: boolean }> = Promise.resolve({
      confirmed: false,
    });
    act(() => {
      first = confirmDialog.run({
        title: 'Procesar',
        message: '¿Procesar?',
        action,
      });
    });
    await userEvent.click(
      await screen.findByRole('button', { name: 'Confirmar' }),
    );
    let second: Promise<boolean> = Promise.resolve(true);
    act(() => {
      second = confirmDialog.confirm({ title: 'Otro', message: '¿Otro?' });
    });
    await expect(second).resolves.toBe(false);
    expect(screen.queryByText('¿Otro?')).not.toBeInTheDocument();
    await act(async () => {
      release();
      await Promise.resolve();
    });
    expect(
      await screen.findByText(/procesado exitosamente/),
    ).toBeInTheDocument();
    act(() => settleConfirm({ confirmed: true }));
    await expect(first).resolves.toEqual({ confirmed: true });
  });

  it('errorHintFor', () => {
    expect(errorHintFor('Persona no encontrada')).toMatch(
      /ya haya sido eliminado/,
    );
    expect(errorHintFor('otra cosa')).toBe('');
  });
});
