# REGISTRY-detail — domain

## time

`src/shared/time/` — **único** lugar con `new Date()`/`Date.now()` (ESLint `no-new-date`). Zona
`America/Argentina/Buenos_Aires`. Branded `Instant` (ISO UTC) y `LocalDate` (`YYYY-MM-DD`).

| Símbolo | Para qué |
| --- | --- |
| `nowInstant()` · `nowMs()` · `todayBsAs()` · `currentYearBsAs()` | Reloj (timers, TTL, "hoy", año por defecto). |
| `formatDate(value, DATE_FORMATS.x)` | Pipe `dateFormat` + `\| date:'…'` de Angular. Acepta ISO, `YYYY-MM-DD`, `DD/MM/YYYY [HH:mm]`, epoch. Inválido → `''`. Las fechas calendario no se corren de día. |
| `DATE_FORMATS` | `date` `13/03/2026` · `time` `15:30` · `dateTime` `13/03/2026, 15:30` · `dateLong` · `dateTimeCompact` · `dayMonth` · `dayMonthYear` · `dayMonthNumeric` · `longDate`. |
| `formatInBsAs(instant, pattern)` | Patrón date-fns libre (locale `es`). |
| `resolveBackendDate(value)` | Cualquier fecha → `Instant` o `null` (fecha calendario = medianoche BsAs). |
| `parseLocalDate` · `parseInstant` · `isLocalDateString` · `localDateOf` | Validar/normalizar (lanzan si es inválido). |
| `addDays` · `daysBetween({from,to})` · `isBefore` · `calculateWeekRange` · `msFromInstant` · `msToInstant` | Aritmética. |
| `toDateInputValue` · `toDateTimeInputValue` · `dateTimeInputToInstant` | `<input type="date|datetime-local">` ↔ backend. |
| `calculateDurationInMinutes({start,end})` · `formatDuration` | Horas `HH:mm` (`time-helpers`). |
| `localDateSchema` · `instantSchema` | zod para el borde de la API (`localDateSchema` acepta `YYYY-MM-DD` y el ISO de medianoche de POST/PATCH). |

## domain

`src/shared/domain/` — una carpeta por dominio (`common`, `persona`, `caja`, `movimiento`,
`inscripcion`, `campamento`, `evento`, `reporte`, `auth`), cada una con `enums.ts` (objeto
`as const` + tipo derivado + `*_LABELS`), `schemas.ts` (zod de las **respuestas**, tipos con
`z.infer`) y `dtos.ts` (bodies/queries como interfaces). Todo se importa de `@/shared/domain`.
Los nombres de entidades/enums respetan el vocabulario del backend (`Movimiento`,
`CONCEPTO_MOVIMIENTO`); las funciones, en inglés. Los modelos que usa **un solo** feature
(p. ej. `persona-dashboard`, `deuda` de reportes) no viven acá: se portan con su feature.

### Contrato real del backend (verificado contra `../backend`, no contra el Angular)

- **Sin wrapper global** de respuesta: cada endpoint devuelve su objeto/array crudo.
- **Decimales:** las entidades crudas (movimiento, campamento, participante, producto) traen
  `decimal` como **string** (`"1500.50"`) en GET y como number en POST → `decimalSchema`.
  Los DTOs armados a mano (inscripción, cajas, KPIs, detalle) ya traen number.
- **Fechas `date`** (`Campamento.fechaInicio/fechaFin`, `Evento.fecha`): `YYYY-MM-DD` en GET,
  ISO de medianoche en POST/PATCH → `localDateSchema` (normaliza a `LocalDate`).
  Timestamps → `instantSchema`.
- **Claves ausentes en POST:** TypeORM no devuelve columnas nullable sin default que no se
  mandaron → `nullableField(schema)` las normaliza a `null`.
- **Paginación:** solo `GET /movimientos` (`movimientosPaginatedSchema`); el resto, arrays.
- `PersonaType.EXTERNA = 'externo'`. `auth/me` devuelve `tipo` en minúscula (PersonaType).
- `EstadoInscripcion.bonificado` existe pero el backend nunca lo emite.
- Reporte de evento: 4 variantes (`venta_mixta` incluida).
- Filtro "educadores" con tres grafías: `educadores` (`/cajas`, `CAJAS_RAMA_EDUCADORES`),
  `educador` (`/inscripciones`, `INSCRIPCIONES_RAMA_EDUCADOR`), `Educadores` (`/reportes/deudas`).
- `GET /personas?soloActivos=false` se interpreta como `true`: para traer todas, omitirlo.

## common

| Símbolo | Para qué |
| --- | --- |
| `decimalSchema` | `"1500.50"` \| `1500.5` → `number`. |
| `nullableField(s)` | Ausente/null → `null`. |
| `baseEntityShape` | `id`, `createdAt`, `updatedAt`, `deletedAt` de `BaseEntity`. |
| `paginatedSchema(item)` · `PaginatedResponse<T>` · `PaginationMeta` · `PAGINATION_DEFAULTS` | `{ data, meta }` del backend. |
| `DAY_OF_WEEK` · `DAY_OF_WEEK_LABELS` · `DAYS_OF_WEEK_IN_ORDER` | Días (solo UI). |

## format

| Símbolo | Para qué |
| --- | --- |
| `formatMoney(value, { decimals?: 0 \| 2, placeholder? })` | Pipe `money`: `$ 1.234` (es-AR, ARS, U+00A0 tras `$`), 0 decimales por defecto, `-` si null/undefined/NaN; `0` → `$ 0`. |
| `humanize(value, 'title' \| 'sentence' \| 'none')` | Pipe `humanize`: `scout_argentina` → `Scout Argentina`. |
| `resolveStatusTone(status)` → `STATUS_TONE` | Datos de `StatusConfigService`: estado (es/en, cualquier caja) → `success`/`info`/`warning`/`danger`/`default`. El color lo pone el design system. |

Fechas: `formatDate` de [`@/shared/time`](#time).
