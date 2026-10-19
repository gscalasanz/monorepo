/**
 * Branded types de fechas (copiados de mi-tienda `packages/shared/src/branded.ts`).
 * La marca vive solo en el tipo (cero costo en runtime): un `string` crudo no entra
 * donde se espera un `Instant`/`LocalDate`, así la regla de timezone se vuelve
 * estructural en vez de "recordada".
 */
declare const brand: unique symbol;

export type Brand<T, B extends string> = T & { readonly [brand]: B };

/** Instante absoluto, serializado ISO-8601 en UTC (`...Z`). */
export type Instant = Brand<string, 'Instant'>;

/** Día calendario de negocio en `America/Argentina/Buenos_Aires`, formato `YYYY-MM-DD`. */
export type LocalDate = Brand<string, 'LocalDate'>;

/**
 * Smart constructors: marcan un valor YA validado (schema zod o funciones de
 * `parse.ts`). Para validar y marcar a la vez, usar `parseInstant`/`parseLocalDate`.
 */
export const asInstant = (value: string): Instant => value as Instant;
export const asLocalDate = (value: string): LocalDate => value as LocalDate;
