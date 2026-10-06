import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';

import { personaSchema, type Persona } from '@/shared/domain';
import {
  EDUCADOR_FIXTURE,
  PROTAGONISTA_FIXTURE,
} from '@/shared/domain/testing/fixtures';
import { todayBsAs } from '@/shared/time';

import { GastoFormDialog } from './gasto-form-dialog';
import { IngresoFormDialog } from './ingreso-form-dialog';

const PERSONAS: readonly Persona[] = [
  personaSchema.parse(PROTAGONISTA_FIXTURE),
  personaSchema.parse(EDUCADOR_FIXTURE),
];

async function pickCombobox(params: {
  user: UserEvent;
  label: RegExp;
  option: string;
}) {
  const input = screen.getByRole('combobox', { name: params.label });
  await params.user.clear(input);
  await params.user.type(input, params.option.slice(0, 3));
  await params.user.click(
    await screen.findByRole('option', { name: params.option }),
  );
}

async function pickSelect(params: {
  user: UserEvent;
  label: RegExp;
  option: string;
}) {
  await params.user.click(screen.getByRole('combobox', { name: params.label }));
  await params.user.click(
    await screen.findByRole('option', { name: params.option }),
  );
}

function renderGasto(onSubmit = vi.fn().mockResolvedValue(undefined)) {
  const onOpenChange = vi.fn();
  render(
    <GastoFormDialog
      open
      onOpenChange={onOpenChange}
      personas={PERSONAS}
      onSubmit={onSubmit}
    />,
  );
  return { onSubmit, onOpenChange, user: userEvent.setup() };
}

async function fillGastoBase(user: UserEvent) {
  await user.type(screen.getByLabelText(/^Monto/), '1500');
  await pickCombobox({ user, label: /^Responsable/, option: 'Juan' });
  await user.type(screen.getByLabelText(/^Descripción/), 'Garrafa');
  await pickSelect({ user, label: /^Medio de Pago/, option: 'Efectivo' });
}

describe('GastoFormDialog', () => {
  it('muestra los errores de Angular al enviar vacío y no llama a onSubmit', async () => {
    const { onSubmit, user } = renderGasto();
    expect(
      screen.getByRole('heading', { name: 'Registrar Gasto' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/^Fecha/)).toHaveValue(todayBsAs());
    await user.click(screen.getByRole('button', { name: 'Registrar Gasto' }));
    expect(
      await screen.findByText('El monto es requerido'),
    ).toBeInTheDocument();
    expect(screen.getByText('Seleccione un responsable')).toBeInTheDocument();
    expect(screen.getByText('La descripción es requerida')).toBeInTheDocument();
    expect(screen.getByText('Seleccione un medio de pago')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('envía los valores validados y cierra', async () => {
    const { onSubmit, onOpenChange, user } = renderGasto();
    await fillGastoBase(user);
    await user.click(screen.getByRole('button', { name: 'Registrar Gasto' }));
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
    expect(onSubmit).toHaveBeenCalledWith({
      monto: 1500,
      fecha: todayBsAs(),
      responsableId: 'per-1',
      descripcion: 'Garrafa',
      medioPago: 'efectivo',
      estadoPago: 'pagado',
      personaAReembolsarId: null,
    });
  });

  it('pendiente de reembolso: banner, precarga y sigue al responsable', async () => {
    const { onSubmit, user } = renderGasto();
    await fillGastoBase(user);
    expect(
      screen.queryByText(/no descuenta del saldo/),
    ).not.toBeInTheDocument();
    await pickSelect({
      user,
      label: /^Estado de Pago/,
      option: 'Pendiente de Reembolso',
    });
    expect(
      screen.getByText(/Este gasto no descuenta del saldo de la caja/),
    ).toBeInTheDocument();
    const persona = screen.getByRole('combobox', {
      name: /^Persona a Reembolsar/,
    });
    expect(persona).toHaveValue('Juan');
    await pickCombobox({ user, label: /^Responsable/, option: 'Laura' });
    expect(persona).toHaveValue('Laura');
    await user.click(screen.getByRole('button', { name: 'Registrar Gasto' }));
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          estadoPago: 'pendiente_reembolso',
          personaAReembolsarId: 'per-2',
        }),
      ),
    );
  });

  it('volver a "Pagado" oculta y limpia la persona', async () => {
    const { onSubmit, user } = renderGasto();
    await fillGastoBase(user);
    await pickSelect({
      user,
      label: /^Estado de Pago/,
      option: 'Pendiente de Reembolso',
    });
    await pickSelect({ user, label: /^Estado de Pago/, option: 'Pagado' });
    expect(
      screen.queryByRole('combobox', { name: /^Persona a Reembolsar/ }),
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Registrar Gasto' }));
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ personaAReembolsarId: null }),
      ),
    );
  });

  it('si onSubmit rechaza queda abierto con el mensaje', async () => {
    const { onOpenChange, user } = renderGasto(
      vi.fn().mockRejectedValue(new Error('Caja sin saldo')),
    );
    await fillGastoBase(user);
    await user.click(screen.getByRole('button', { name: 'Registrar Gasto' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Caja sin saldo',
    );
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});

describe('IngresoFormDialog', () => {
  function renderIngreso() {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const onOpenChange = vi.fn();
    render(
      <IngresoFormDialog
        open
        onOpenChange={onOpenChange}
        personas={PERSONAS}
        onSubmit={onSubmit}
      />,
    );
    return { onSubmit, onOpenChange, user: userEvent.setup() };
  }

  it('valida, ofrece los 4 medios y envía', async () => {
    const { onSubmit, onOpenChange, user } = renderIngreso();
    const dialog = screen.getByRole('dialog');
    expect(
      within(dialog).getByPlaceholderText('Ej: Venta de rifas, cuotas, etc.'),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Registrar Ingreso' }));
    expect(
      await screen.findByText('El monto es requerido'),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();

    await user.type(screen.getByLabelText(/^Monto/), '750');
    await user.type(screen.getByLabelText(/^Descripción/), 'Venta de rifas');
    await pickCombobox({ user, label: /^Responsable/, option: 'Laura' });
    await user.click(screen.getByRole('combobox', { name: /^Medio de Pago/ }));
    for (const label of ['Efectivo', 'Transferencia', 'Saldo Personal']) {
      expect(
        await screen.findByRole('option', { name: label }),
      ).toBeInTheDocument();
    }
    await user.click(screen.getByRole('option', { name: 'Mixto' }));
    await user.click(screen.getByRole('button', { name: 'Registrar Ingreso' }));
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
    expect(onSubmit).toHaveBeenCalledWith({
      monto: 750,
      descripcion: 'Venta de rifas',
      responsableId: 'per-2',
      medioPago: 'mixto',
    });
  });

  it('Cancelar cierra el diálogo', async () => {
    const { onOpenChange, user } = renderIngreso();
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
