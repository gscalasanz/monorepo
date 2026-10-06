import { z } from 'zod';

import {
  DAY_OF_WEEK,
  DAY_OF_WEEK_LABELS,
  DAYS_OF_WEEK_IN_ORDER,
  decimalSchema,
  nullableField,
  paginatedSchema,
} from '@/shared/domain';

describe('decimalSchema', () => {
  it('convierte el string de una columna decimal (GET de entidad cruda) a number', () => {
    expect(decimalSchema.parse('1500.50')).toBe(1500.5);
  });

  it('acepta number (DTOs armados a mano y respuestas de POST)', () => {
    expect(decimalSchema.parse(1500.5)).toBe(1500.5);
  });

  it.each(['', 'abc', null, Number.NaN])('rechaza %s', (value) => {
    expect(decimalSchema.safeParse(value).success).toBe(false);
  });
});

describe('nullableField', () => {
  const schema = z.object({ descripcion: nullableField(z.string()) });

  it('una clave ausente (POST de TypeORM sin RETURNING) se normaliza a null', () => {
    expect(schema.parse({})).toEqual({ descripcion: null });
  });

  it('respeta null y valores presentes', () => {
    expect(schema.parse({ descripcion: null })).toEqual({ descripcion: null });
    expect(schema.parse({ descripcion: 'x' })).toEqual({ descripcion: 'x' });
  });
});

describe('paginatedSchema', () => {
  const schema = paginatedSchema(z.object({ id: z.string() }));

  it('parsea { data, meta } como lo devuelve GET /movimientos', () => {
    const body = {
      data: [{ id: 'a' }],
      meta: {
        page: 1,
        limit: 20,
        total: 1,
        totalPages: 1,
        hasPreviousPage: false,
        hasNextPage: false,
      },
    };
    expect(schema.parse(body)).toEqual(body);
  });

  it('rechaza un meta incompleto', () => {
    expect(schema.safeParse({ data: [], meta: { page: 1 } }).success).toBe(false);
  });
});

describe('DayOfWeek', () => {
  it('lista los 7 días de lunes a domingo con label en castellano', () => {
    expect(DAYS_OF_WEEK_IN_ORDER[0]).toBe(DAY_OF_WEEK.MONDAY);
    expect(DAYS_OF_WEEK_IN_ORDER).toHaveLength(7);
    expect(DAY_OF_WEEK_LABELS[DAY_OF_WEEK.WEDNESDAY]).toBe('Miércoles');
  });
});
