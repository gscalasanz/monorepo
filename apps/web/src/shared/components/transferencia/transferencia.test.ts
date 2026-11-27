import { cajaResponseSchema, type CajaConSaldo } from '@/shared/domain';
import { CAJA_RESPONSE_FIXTURE } from '@/shared/domain/testing/fixtures';
import {
  buildTransferenciaDto,
  destinoOptions,
  transferenciaPrecheck,
} from '@/shared/components/transferencia';

const caja = (patch: Partial<CajaConSaldo> = {}): CajaConSaldo => ({
  ...cajaResponseSchema.parse(CAJA_RESPONSE_FIXTURE),
  ...patch,
});

const cajas = [
  caja({ id: 'g', tipo: 'grupo', nombre: null }),
  caja({ id: 'm', tipo: 'rama_manada', nombre: null }),
  caja({ id: 'p' }),
  caja({ id: 'p2' }),
  caja({ id: 'fs', tipo: 'fondo_solidario', nombre: 'Fondo Solidario' }),
];

describe('transferencia', () => {
  it('destinos sin el origen ni cuentas personales', () => {
    const options = destinoOptions({ cajas, origenId: 'g' });
    expect(options).toEqual([
      { value: 'm', label: 'Fondo Manada' },
      { value: 'fs', label: 'Fondo Solidario' },
    ]);
  });

  it('con incluirPersonales ofrece las cuentas personales (menos el origen)', () => {
    const options = destinoOptions({
      cajas,
      origenId: 'p',
      incluirPersonales: true,
    });
    expect(options.map((o) => o.value)).toEqual(['g', 'm', 'p2', 'fs']);
  });

  it('no ofrece cuentas de personas deshabilitadas', () => {
    const base = caja({ id: 'p3' });
    const inactiva = caja({
      id: 'p3',
      propietario: { ...base.propietario!, estado: 'inactivo' },
    });
    const options = destinoOptions({
      cajas: [...cajas, inactiva],
      origenId: 'p',
      incluirPersonales: true,
    });
    expect(options.map((o) => o.value)).not.toContain('p3');
  });

  it('chequeos de cliente: usuario y saldo', () => {
    expect(transferenciaPrecheck({ userId: null, monto: 1, saldo: 10 })).toBe(
      'No se pudo identificar al usuario autenticado',
    );
    expect(
      transferenciaPrecheck({ userId: 'u', monto: 11, saldo: 10 }),
    ).toMatch(/^Saldo insuficiente en la caja origen \(disponible: /);
    expect(
      transferenciaPrecheck({ userId: 'u', monto: 10, saldo: 10 }),
    ).toBeNull();
  });

  it('DTO omite descripción vacía', () => {
    const values = {
      cajaDestinoId: 'm',
      monto: 5,
      fecha: '2026-10-06',
      descripcion: '  ',
    };
    expect(
      buildTransferenciaDto({ origenId: 'g', responsableId: 'u', values }),
    ).toEqual({
      cajaOrigenId: 'g',
      cajaDestinoId: 'm',
      monto: 5,
      responsableId: 'u',
      fecha: '2026-10-06',
    });
    expect(
      buildTransferenciaDto({
        origenId: 'g',
        responsableId: 'u',
        values: { ...values, monto: null },
      }),
    ).toBeNull();
  });
});
