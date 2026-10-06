import { z } from 'zod';

import {
  VALIDATION_MESSAGES,
  bonificacionDisponible,
  comprobanteEntregado,
  credencialesCompletas,
  dateRange,
  decimalPlaces,
  fechasCampamento,
  maxAmount,
  positiveNumber,
  ramaValida,
  refineWith,
  safeText,
  saldoSuficiente,
} from '@/shared/validators';

const M = VALIDATION_MESSAGES;

describe('positiveNumber (custom-validators, el que usan los forms)', () => {
  it.each([10, '10', 0.5])('%s es válido', (value) => {
    expect(positiveNumber(value)).toBeNull();
  });

  it.each([-1, '-3', 'abc'])('%s es inválido', (value) => {
    expect(positiveNumber(value)).toBe(M.POSITIVE_NUMBER);
  });

  it.each([null, undefined, '', 0])(
    '%s se deja al "requerido" (paridad: 0 pasa)',
    (value) => {
      expect(positiveNumber(value)).toBeNull();
    },
  );
});

describe('decimalPlaces', () => {
  const twoDecimals = decimalPlaces(2);
  it.each([10, '10.5', '10.55', ''])('%s ok', (value) => {
    expect(twoDecimals(value)).toBeNull();
  });
  it('más decimales que el máximo', () => {
    expect(twoDecimals('10.555')).toBe(M.MAX_DECIMALS(2));
  });
  it('formato con más de un punto', () => {
    expect(twoDecimals('1.2.3')).toBe(M.INVALID_DECIMAL);
  });
});

describe('safeText (XSS: rechaza < > " \' ; & | `)', () => {
  it.each(['Juan Pérez', 'Compra: harina 2kg', ''])('%s ok', (value) => {
    expect(safeText(value)).toBeNull();
  });
  it.each(['<script>', 'a & b', "O'Connor", 'x;y', 'a|b', 'a`b', '"x"'])(
    '%s inválido',
    (value) => {
      expect(safeText(value)).toBe(M.UNSAFE_TEXT);
    },
  );
});

describe('ramaValida', () => {
  it('acepta ramas del backend y vacío', () => {
    expect(ramaValida('Manada')).toBeNull();
    expect(ramaValida('')).toBeNull();
    expect(ramaValida(null)).toBeNull();
  });
  it('rechaza otra cosa (case-sensitive)', () => {
    expect(ramaValida('manada')).toBe(M.INVALID_RAMA);
  });
});

describe('dateRange (campamentos: inicio ≤ fin)', () => {
  it('igual o posterior ok; incompleto ok', () => {
    expect(dateRange({ start: '2026-01-15', end: '2026-01-15' })).toBeNull();
    expect(dateRange({ start: '2026-01-15', end: '2026-01-20' })).toBeNull();
    expect(dateRange({ start: '', end: '2026-01-20' })).toBeNull();
  });
  it('fin antes que inicio', () => {
    expect(dateRange({ start: '2026-01-20', end: '2026-01-15' })).toBe(
      M.INVALID_DATE_RANGE,
    );
  });
});

describe('fechasCampamento (fin estrictamente posterior)', () => {
  it('mismo día es inválido', () => {
    expect(
      fechasCampamento({ fechaInicio: '2026-01-15', fechaFin: '2026-01-15' }),
    ).toBe(M.FECHAS_CAMPAMENTO);
    expect(
      fechasCampamento({ fechaInicio: '2026-01-15', fechaFin: '2026-01-16' }),
    ).toBeNull();
    expect(fechasCampamento({ fechaInicio: '', fechaFin: '' })).toBeNull();
  });
});

describe('credencialesCompletas (email y password juntos o ninguno)', () => {
  it.each([
    [{ email: '', password: '' }, null],
    [{ email: 'a@b.c', password: 'Secreta1' }, null],
    [{ email: 'a@b.c', password: '  ' }, M.CREDENCIALES_INCOMPLETAS],
    [{ email: undefined, password: 'x' }, M.CREDENCIALES_INCOMPLETAS],
  ])('%o → %s', (value, expected) => {
    expect(credencialesCompletas(value)).toBe(expected);
  });
});

describe('maxAmount', () => {
  it('no supera el máximo', () => {
    expect(maxAmount(100)(100)).toBeNull();
    expect(maxAmount(100)('')).toBeNull();
    expect(maxAmount(100)(101)).toBe(M.MAX_AMOUNT(100));
  });
});

describe('bonificacionDisponible', () => {
  const inscripciones = [
    { ano: 2026, estado: 'bonificado' },
    { ano: 2025, estado: 'pagado' },
  ];
  it('rechaza si ya hay una bonificada ese año', () => {
    expect(
      bonificacionDisponible({ aplicar: true, ano: 2026, inscripciones }),
    ).toBe(M.BONIFICACION_NO_DISPONIBLE);
  });
  it('ok si no se aplica o es otro año', () => {
    expect(
      bonificacionDisponible({ aplicar: false, ano: 2026, inscripciones }),
    ).toBeNull();
    expect(
      bonificacionDisponible({ aplicar: true, ano: 2025, inscripciones }),
    ).toBeNull();
  });
});

describe('comprobanteEntregado', () => {
  it('requerido y no entregado es inválido', () => {
    expect(
      comprobanteEntregado({
        requiereComprobante: true,
        comprobanteEntregado: false,
      }),
    ).toBe(M.COMPROBANTE_PENDIENTE);
    expect(
      comprobanteEntregado({
        requiereComprobante: true,
        comprobanteEntregado: true,
      }),
    ).toBeNull();
    expect(comprobanteEntregado({ requiereComprobante: false })).toBeNull();
  });
});

describe('saldoSuficiente', () => {
  it('el monto no puede superar el saldo', () => {
    expect(saldoSuficiente({ monto: 150, saldo: 100 })).toBe(
      'Saldo insuficiente. Disponible: $100',
    );
    expect(saldoSuficiente({ monto: 100, saldo: 100 })).toBeNull();
    expect(saldoSuficiente({ monto: 'x', saldo: 0 })).toBeNull();
    expect(saldoSuficiente({ monto: 0, saldo: 0 })).toBeNull();
  });
});

describe('refineWith (adaptador a zod)', () => {
  it('campo: agrega el mensaje del validador', () => {
    const schema = z.string().superRefine(refineWith(safeText));
    const result = schema.safeParse('<b>');
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(M.UNSAFE_TEXT);
    expect(schema.safeParse('ok').success).toBe(true);
  });

  it('objeto: el error queda en el path indicado', () => {
    const schema = z
      .object({ fechaInicio: z.string(), fechaFin: z.string() })
      .superRefine(
        refineWith(
          (v) => dateRange({ start: v.fechaInicio, end: v.fechaFin }),
          {
            path: ['fechaFin'],
          },
        ),
      );
    const result = schema.safeParse({
      fechaInicio: '2026-01-20',
      fechaFin: '2026-01-15',
    });
    expect(result.error?.issues[0]?.path).toEqual(['fechaFin']);
  });
});
