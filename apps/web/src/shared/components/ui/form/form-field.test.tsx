import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { FORM_COPY } from '@/shared/components/ui/form/copy';
import { TextField } from '@/shared/components/ui/form/text-field';

const noop = vi.fn();

describe('FormField (vía TextField): cableado accesible', () => {
  it('asocia label ↔ control y marca obligatorio', () => {
    render(<TextField label="Nombre" value="" onChange={noop} required />);
    const input = screen.getByLabelText(/Nombre/);
    expect(input).toBeRequired();
    expect(screen.getByText(FORM_COPY.requiredHint)).toBeInTheDocument();
  });

  it('describe con la ayuda cuando no hay error', () => {
    render(
      <TextField
        label="Email"
        value=""
        onChange={noop}
        helper="Lo usamos para avisos"
      />,
    );
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAccessibleDescription('Lo usamos para avisos');
    expect(input).not.toHaveAttribute('aria-invalid');
  });

  it('con error: aria-invalid, describedby al error y role=alert (reemplaza la ayuda)', () => {
    render(
      <TextField
        label="Email"
        value="x"
        onChange={noop}
        helper="Ayuda"
        error="Ingresá un email válido"
      />,
    );
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Ingresá un email válido');
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Ingresá un email válido',
    );
    expect(screen.queryByText('Ayuda')).not.toBeInTheDocument();
  });

  it('respeta el id provisto', () => {
    render(<TextField id="mi-campo" label="Nombre" value="" onChange={noop} />);
    expect(screen.getByLabelText('Nombre')).toHaveAttribute('id', 'mi-campo');
  });

  it('válido: check con texto para lectores; deshabilitado: candado', () => {
    const { rerender } = render(
      <TextField label="Nombre" value="Ana" onChange={noop} valid />,
    );
    expect(screen.getByText(FORM_COPY.validHint)).toBeInTheDocument();
    rerender(<TextField label="Nombre" value="Ana" onChange={noop} disabled />);
    expect(screen.getByLabelText('Nombre')).toBeDisabled();
    expect(screen.getByText(FORM_COPY.disabledHint)).toBeInTheDocument();
    expect(screen.queryByText(FORM_COPY.validHint)).not.toBeInTheDocument();
  });

  it('no muestra check si hay error aunque valid sea true', () => {
    render(
      <TextField label="Nombre" value="" onChange={noop} valid error="Falta" />,
    );
    expect(screen.queryByText(FORM_COPY.validHint)).not.toBeInTheDocument();
  });
});
