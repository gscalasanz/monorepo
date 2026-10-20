# REGISTRY-detail — domain

Dos niveles (ver `docs/estructura-frontend.md`): **`@scout/shared`** (lo comparten web y api) y
**`apps/web/src/shared`** (solo web). Regla de promoción en `CLAUDE.md` §4.

## `@scout/shared/enums`

`packages/shared/src/enums/<dominio>.ts`. Representación: objeto `as const` + tipo homónimo,
nombre PascalCase del api (ADR `docs/adr/0001-representacion-enums.md`). Valores verificados
contra `packages/shared/test/fixtures/wire-values.snapshot.json` por
`packages/shared/test/wire-contract.test.ts`. **Un valor nuevo se agrega acá** (y en el snapshot).

| Archivo | Exports |
| --- | --- |
| `persona.ts` | `PersonaType` (`protagonista`, `educador`, `externo`, `agrupacion`) · `EstadoPersona` · `Rama` · `CargoEducador` |
| `caja.ts` | `CajaType` (`grupo`, `rama_*` ×4, `personal`, `fondo_solidario`) |
| `movimiento.ts` | `TipoMovimiento` · `ConceptoMovimiento` · `MedioPago` · `EstadoPago` · `CategoriaMovimiento` · `FiltroMovimientosCampamento` · `VENTA_DERIVED_CONCEPTOS` |
| `inscripcion.ts` | `EstadoInscripcion` · `TipoInscripcion` · `TipoDeuda` |
| `campamento.ts` | `EstadoPagoCampamento` |
| `evento.ts` | `TipoEvento` · `DestinoGanancia` · `ModalidadVenta` · `EstadoCobroVenta` |
| `reporte.ts` | `REPORTE_VARIANTE`/`ReporteVariante` · `REPORTE_SEVERIDAD`/`ReporteSeveridad` · `RAMA_EDUCADORES` · `DEUDA_RAMA_FILTERS`/`DeudaRamaFilter` · `TipoDeudaFilter` |

Adaptadores (no definen nada, solo re-exportan):
- api: `apps/api/src/common/enums/index.ts` (mismos nombres).
- web: `apps/web/src/shared/domain/<dominio>/enums.ts` con los nombres históricos de web
  (`RAMA`, `CAJA_TYPE`, `CONCEPTO_MOVIMIENTO`…; `FILTRO_MOVIMIENTOS` = `FiltroMovimientosCampamento`)
  + los `*_LABELS` (copy, solo web).

## `@scout/shared/time`

`packages/shared/src/time/` — **único** lugar que lee el reloj y construye fechas (ESLint
`no-new-date`). Zona `BSAS_TIME_ZONE` = `America/Argentina/Buenos_Aires` (una sola definición).
Sin zod. Branded `Instant` (ISO UTC) y `LocalDate` (`YYYY-MM-DD`).

| Archivo | Exports | Para qué |
| --- | --- | --- |
| `branded.ts` | `Brand` · `Instant` · `LocalDate` · `asInstant` · `asLocalDate` | Tipos branded. |
| `constants.ts` | `BSAS_TIME_ZONE` · `DATE_FORMATS`/`DateFormat` · `LOCAL_DATE_PATTERN` · `DATE_TIME_INPUT_PATTERN` · `MS_PER_SECOND` · `MS_PER_MINUTE` | `DATE_FORMATS`: `date` `13/03/2026` · `time` `15:30` · `dateTime` · `dateLong` · `dateTimeCompact` · `dayMonth` · `dayMonthYear` · `dayMonthNumeric`… |
| `clock.ts` | `nowInstant()` · `nowMs()` · `todayBsAs()` · `currentYearBsAs()` | Reloj (timers, TTL, "hoy", año por defecto). |
| `format.ts` | `formatDate(value, DATE_FORMATS.x)` · `formatInBsAs(instant, pattern)` | Formato. `formatDate` acepta ISO, `YYYY-MM-DD`, `DD/MM/YYYY [HH:mm]`, epoch; inválido → `''`; las fechas calendario no se corren de día. |
| `parse.ts` | `resolveBackendDate` · `parseLocalDate` · `parseInstant` · `isLocalDateString` · `localDateOf` · `addDays` · `daysBetween({from,to})` · `isBefore` · `calculateWeekRange` · `msFromInstant` · `msToInstant` · `dayFilterBounds({from?,to?})` | Validar/normalizar (lanzan si es inválido) y aritmética. **`dayFilterBounds`** siempre al mandar rangos de días al backend: `YYYY-MM-DD` crudo es medianoche UTC y deja afuera el día final. |
| `input.ts` | `toDateInputValue` · `toDateTimeInputValue` · `dateTimeInputToInstant` | `<input type="date|datetime-local">` ↔ backend. |
| `duration.ts` | `calculateDurationInMinutes({start,end})` · `formatDuration` · `TimeOfDayRange` | Horas `HH:mm`. |

api: `APP_TIMEZONE` (`apps/api/src/common/constants/app.constants.ts`) es alias de `BSAS_TIME_ZONE`.

## web: `shared/time`

`apps/web/src/shared/time/` (`@/shared/time`) — re-exporta `@scout/shared/time` con la misma API
(exports listados a mano por Turbopack) y suma los schemas zod de borde (solo web):
`localDateSchema` (acepta `YYYY-MM-DD` y el ISO de medianoche de POST/PATCH) · `instantSchema`.
Es el único punto de import de fechas en web.

## web: `shared/domain`

`apps/web/src/shared/domain/` — una carpeta por dominio (`common`, `persona`, `caja`,
`movimiento`, `inscripcion`, `campamento`, `evento`, `reporte`, `auth`), cada una con `enums.ts`
(re-export de `@scout/shared/enums` + `*_LABELS`), `schemas.ts` (zod de las **respuestas**, tipos
con `z.infer`) y `dtos.ts` (bodies/queries como interfaces). Todo se importa de `@/shared/domain`.
Los modelos que usa **un solo** feature (p. ej. `persona-dashboard`) no viven acá: van con su
feature. `personaDeudaSchema`/`personasDeudaSchema`/`PersonaDeuda` (`GET /reportes/deudas`) viven
en `reporte/deudas.ts` porque los usan reportes y dashboard.

### Contrato real del api (verificado contra `apps/api`)

- **Sin wrapper global** de respuesta: cada endpoint devuelve su objeto/array crudo.
- **Decimales:** las entidades crudas (movimiento, campamento, participante, producto) traen
  `decimal` como **string** (`"1500.50"`) en GET y como number en POST → `decimalSchema`.
  Los DTOs armados a mano (inscripción, cajas, KPIs, detalle) ya traen number.
- **Fechas `date`** (`Campamento.fechaInicio/fechaFin`, `Evento.fecha`): `YYYY-MM-DD` en GET,
  ISO de medianoche en POST/PATCH → `localDateSchema`. Timestamps → `instantSchema`.
- **Claves ausentes en POST:** TypeORM no devuelve columnas nullable sin default que no se
  mandaron → `nullableField(schema)` las normaliza a `null`.
- **Paginación:** solo `GET /movimientos` (`movimientosPaginatedSchema`); el resto, arrays.
- `PersonaType.EXTERNA = 'externo'`. `auth/me` devuelve `tipo` en minúscula (PersonaType).
- `EstadoInscripcion.bonificado` existe pero el api nunca lo emite.
- Reporte de evento: 4 variantes (`venta_mixta` incluida).
- Filtro "educadores" con tres grafías (deuda conocida, MONOREPO.md §Deuda): `educadores`
  (`/cajas`, `CAJAS_RAMA_EDUCADORES`), `educador` (`/inscripciones`, `INSCRIPCIONES_RAMA_EDUCADOR`),
  `Educadores` (`/reportes/deudas`, `RAMA_EDUCADORES`).
- `GET /personas?soloActivos=false` se interpreta como `true`: para traer todas, omitirlo.

## common

`apps/web/src/shared/domain/common/`

| Símbolo | Para qué |
| --- | --- |
| `decimalSchema` | `"1500.50"` \| `1500.5` → `number`. |
| `nullableField(s)` | Ausente/null → `null`. |
| `baseEntityShape` | `id`, `createdAt`, `updatedAt`, `deletedAt` de `BaseEntity`. |
| `paginatedSchema(item)` · `PaginatedResponse<T>` · `PaginationMeta` · `PAGINATION_DEFAULTS` | `{ data, meta }` del api. |
| `DAY_OF_WEEK` · `DAY_OF_WEEK_LABELS` · `DAYS_OF_WEEK_IN_ORDER` | Días (solo UI). |

## Links entre pantallas

`apps/web/src/shared/constants/links.ts` — el contrato de URLs entre pantallas, para que quien
enlaza y quien lee los query params no se desincronicen.

| Símbolo | Qué hace |
| --- | --- |
| `cajasHref(tab?)` | `/cajas` o `/cajas?tab=<grupo\|rama\|personal\|fondo-solidario>` (`CAJAS_TAB`, `CAJAS_TAB_PARAM`). |
| `movimientosHref({ tipo?, estadoPago?, concepto?, fechaInicio?, fechaFin?, cajaId? })` | `/movimientos` con solo los filtros presentes (`MOVIMIENTOS_LIST_PARAMS` = nombres que lee la lista). |
| `personaHref({ tipo, id })` | Ficha según `PERSONA_TYPE_ROUTES`; una agrupación va a `/personas`. |
| `movimientoEditHref(id)` | `/movimientos/:id/editar` (no hay detalle ruteado). |

## format

`apps/web/src/shared/format/`

| Símbolo | Para qué |
| --- | --- |
| `initialsOf(nombre)` | `"Valentina Ríos"` → `"VR"` (2 palabras máx., mayúscula es-AR); vacío → `''`. |
| `formatMoney(value, { decimals?: 0 \| 2, placeholder? })` | `$ 1.234` (es-AR, ARS, U+00A0 tras `$`), 0 decimales por defecto, `-` si null/undefined/NaN; `0` → `$ 0`. |
| `humanize(value, 'title' \| 'sentence' \| 'none')` | `scout_argentina` → `Scout Argentina`. |
| `resolveStatusTone(status)` → `STATUS_TONE` | Estado (es/en, cualquier caja) → `success`/`info`/`warning`/`danger`/`default`. El color lo pone el design system. |

Fechas: `formatDate` de [`@scout/shared/time`](#scoutsharedtime).

## validators

`apps/web/src/shared/validators/` — validadores puros `valor → mensaje | null` (mensajes en
`VALIDATION_MESSAGES`), para zod con `refineWith(validador, { path? })`:

```ts
z.object({ monto: z.coerce.number().superRefine(refineWith(positiveNumber)), descripcion: z.string().superRefine(refineWith(safeText)) })
  .superRefine(refineWith((v) => dateRange({ start: v.fechaInicio, end: v.fechaFin }), { path: ['fechaFin'] }));
```

| Validador | Semántica |
| --- | --- |
| `positiveNumber` | Vacío **y 0** pasan (lo obligatorio es `required`); NaN o ≤0 → error. |
| `decimalPlaces(n)` · `maxAmount(max)` | Máx. decimales · tope de monto. |
| `safeText` | Rechaza `< > " ' ; & \| \`` (ojo: también apóstrofes, p. ej. "O'Connor"). |
| `ramaValida` | Vacío o una de `RAMAS`. |
| `dateRange({start,end})` | Fin ≥ inicio. |
| `fechasCampamento` | Fin **>** inicio (estricto). |
| `credencialesCompletas` | Email y password del educador: ambos o ninguno. |
| `comprobanteEntregado` · `bonificacionDisponible` · `saldoSuficiente` | Reglas de formularios de movimientos/bonificaciones. |
| `personaAReembolsarRequerida` · `personaAReembolsarOnEstadoChange` · `personaAReembolsarOnResponsableChange` | Funciones puras: el form llama a las `On*Change` al cambiar estado/responsable. |

## settings

`apps/web/src/shared/settings/` — montos por defecto de inscripción en `localStorage`
(`scout_inscripcion_config`, `{ montoScoutArgentina, montoGrupo }`): `loadInscripcionConfig()`
(campo inválido o faltante → 0, JSON corrupto → defaults), `updateInscripcionConfig(partial)`
(devuelve config nueva y persiste), `saveInscripcionConfig(config)` (`false` si no pudo),
`montoByTipo(config, tipo)`. Storage vía `@/shared/storage` (`readItem`/`writeItem`/`removeItem`, SSR-safe).
