# Principios de Ingeniería — Scout

> Documento de cabecera. Guía de decisión para cualquiera (humano o agente) que escriba código
> en este monorepo. Si una decisión de implementación no es obvia, se resuelve con lo que dice
> acá. Adaptado de `mi-tienda/docs/principios-ingenieria.md` al stack real de Scout.

---

## Principio rector: "Mínimo necesario, máximo reusado"

> **Antes de escribir código nuevo, buscá si ya existe. Si no existe, construí solo lo que
> necesitás hoy — ni más, ni más complejo.**

1. **Reusar** → buscar siempre primero (es gratis): `REGISTRY.md`, codebase-memory.
2. **YAGNI** → si no existe, construir solo lo de hoy (no "por si acaso").
3. **DRY real** → abstraer recién en la 3ª repetición.

> **En el monorepo esto es estructural:** `@scout/shared` existe para que web y api **no
> redefinan el mismo vocabulario**. Pero solo sube ahí lo que hoy usan las dos apps.

---

## La regla de decisión (uso diario)

Cada vez que vas a crear **un componente, un service de Nest, una query, una utilidad, un tipo**:

```
┌─ ¿Ya existe en @scout/shared, en apps/*/src/shared|common, o en el design system?
│     SÍ  → usalo.                                    [Reuse]
│
├─ ¿Existe algo ~80% parecido?
│     SÍ  → extendelo con props/parámetros.           [Reuse + extender]
│
└─ No existe nada:
      ¿Lo necesito AHORA (no "por si acaso")?
         NO → no lo construyas todavía.               [YAGNI]
         SÍ → construí lo más simple que funcione,    [KISS]
              y ubicalo donde el próximo lo encuentre. [SSOT]
```

---

## Stack técnico (la convención: si no la seguís, la búsqueda falla)

| Capa | Elección | Nota |
| --- | --- | --- |
| Monorepo | **pnpm workspaces + Turborepo** | `pnpm` obligatorio; no mezclar npm/yarn |
| Web | **Next.js 16 (App Router) + React 19 + TS strict** | ReUI (shadcn) + Tailwind 4 |
| API | **NestJS 11** | modular por dominio, DI |
| DB / ORM | **PostgreSQL + TypeORM 0.3** | entidades con decoradores, migraciones TypeORM |
| Validación | **class-validator** (api, DTOs) · **zod** (web, en el borde) | no hay una capa única compartida |
| Auth | **JWT propio** (access + refresh, `@nestjs/passport`) | guard global + `@Public()` |
| Estado cliente | **zustand** | solo si React local no alcanza |
| Fechas | **date-fns** + **date-fns-tz** | todo vía `@scout/shared/time` |
| Tests | **Jest** (api) · **Vitest** + **Playwright** (web) · Vitest (`@scout/shared`) | |

### Dónde vive cada cosa

```
apps/web/          Next.js — feature-based (docs/estructura-frontend.md)
apps/api/          NestJS — un módulo por dominio (docs/estructura-backend.md)
packages/shared/   @scout/shared — enums de dominio (./enums) + time (./time)
packages/config/   @scout/config — tsconfig + eslint compartidos
```

**Regla de oro:** el vocabulario de dominio que cruza el cable vive en `@scout/shared` y lo
importan web y api. Una sola definición (ADR 0001).

**Regla de promoción:**
- Usado en **una sola pantalla/feature/módulo** → vive junto a ello.
- Usado por **2+ features de web** → `apps/web/src/shared`.
- Usado por **2+ módulos del api** → `apps/api/src/common`.
- Usado **hoy por las dos apps** → `packages/shared`.
- Se **registra** en `REGISTRY.md` en el mismo commit. Nada se duplica.

Lo que **no** sube a `@scout/shared`: copy/labels (`*_LABELS`), schemas zod (solo web), DTOs con
class-validator (solo api), entidades TypeORM.

---

## Convenciones de nombres

1. **Identificadores en inglés; copy al usuario en español rioplatense**, centralizado.
   - **Matiz — vocabulario de dominio en español:** los valores y nombres del modelo
     (`Movimiento`, `ConceptoMovimiento`, `efectivo`, `Manada`, `scout_argentina`) están en
     español a propósito y se respetan tal cual. El código que los rodea es inglés.
2. **Prohibido magic strings y magic numbers.** Todo literal con significado va a una `const` o
   a un objeto `as const` (en la app que lo usa, o en `@scout/shared` si es de wire).
   - ❌ `if (dias > 30)` · `setTimeout(…, 840000)`
   - ✅ `if (dias > MAX_DIAS_DEUDA)` · `KEEP_ALIVE_MS`
3. **Sin variables de una sola letra** (salvo `i` en un `for` clásico o `e` para `event`).
4. **Nombres predecibles:** componentes React en `PascalCase` con archivo `kebab-case`
   (convención actual de web); en el api, `<dominio>.service.ts`, `<dominio>.controller.ts`,
   `*.dto.ts`, `*.entity.ts`. Un nombre por concepto.
5. **Imports con alias / workspace** (`@/…`, `@scout/shared/enums`, `@scout/shared/time`).
   Nada de `../../../`.

---

## El registro (REGISTRY): el mecanismo de "buscá primero"

1. **`REGISTRY.md`** (raíz) — routing por categoría + índice alfabético.
2. **`REGISTRY-detail/<categoría>.md`** — `domain` (`@scout/shared`, dominio de web) · `api`
   (`apps/api/src/common` + cliente HTTP de web) · `ui` (componentes de web) · `testing`.

Protocolo: buscar → leer solo el detail → reutilizar/extender → si se crea algo reutilizable,
actualizar índice **y** detail **en el mismo commit**. Grow-on-miss: no se registra lo que no
existe ni lo que tiene un solo uso trivial.

---

## Contrato HTTP

- El api devuelve **respuestas crudas** (sin envelope `ApiResult`), con prefijo `/api/v1`.
  Errores = excepciones HTTP de Nest (`message` string o array). **El contrato no se cambia**
  sin acordarlo: lo consume `apps/web` y está documentado en Swagger (`/api/docs`).
- **Validación en el borde, en los dos lados:**
  - api: DTO con class-validator + `ValidationPipe` global (`whitelist`,
    `forbidNonWhitelisted`, `transform`).
  - web: schema zod en cada lectura (`apiClient.get(url, { schema })`); una respuesta fuera de
    contrato es un `ApiError` de tipo `contract`, no un dato a medias.
- **Paginación:** hoy solo `GET /movimientos` pagina (`{ data, meta }`). Un listado nuevo que
  pueda crecer sin límite debería paginar con el mismo `PaginatedResponseDto`.

```ts
// ✅ api: validación en el borde (DTO) + lógica en el service
@Post()
create(@Body() dto: CreateMovimientoDto): Promise<Movimiento> {
  return this.movimientosService.create(dto);
}

// ✅ web: la respuesta se valida antes de usarla
const cajas = await apiClient.get(API_ENDPOINTS.CAJAS, { schema: cajasResponseSchema });
```

---

## Manejo de errores y logging

1. **Nunca tragar errores.** Todo `catch` loguea con contexto o re-lanza; nunca un `catch {}` vacío.
2. **Fail fast:** errores temprano y ruidosos en el servidor.
3. **Al usuario, mensaje humano en español.** Nunca stack traces. En web, `ApiError.message` ya
   es el texto a mostrar (mensaje de Nest o fallback por status).
4. **Movimientos = libro contable.** No se borra nada que tenga movimientos
   (`DeletionValidatorService`); el borrado es soft delete.
5. **Qué NO se loguea nunca:** contraseñas, tokens (access/refresh), `DATABASE_URL` ni ningún
   secreto. PII solo si es imprescindible; si no, referenciar por id.

---

## Principios de soporte

| Decisión | Principio |
| --- | --- |
| ¿Construyo o reuso? | **DRY + Single Source of Truth** |
| ¿Cuánto construyo? | **YAGNI** (solo lo de hoy) |
| ¿Qué tan complejo? | **KISS** (lo más simple que ande) |
| ¿Cuándo abstraigo? | **Regla de tres** |
| ¿Cómo lo estructuro? | **Alta cohesión, bajo acoplamiento** |
| ¿Cómo separo? | **Separation of Concerns**, por feature/dominio |
| ¿Cómo lo dejo? | **Boy Scout Rule** |
| ¿Cómo fallo? | **Fail Fast** |

---

## Cómo se hace cumplir

Detalle en [`flujo-confiable.md`](./flujo-confiable.md). Resumen:

- **Tipos:** branded `Instant`/`LocalDate`; enums `as const` compartidos; test de contrato de wire.
- **ESLint de arquitectura** (`@scout/config`): fronteras del monorepo, fronteras entre features
  de web, `no-new-date`, límites de tamaño en web.
- **REGISTRY** + codebase-memory → "¿qué ya existe?" en segundos.
- **Gates de commit/CI** (husky + lint-staged + commitlint, CI quality + security): planificados
  en MONOREPO.md Fase 6.

---

## Git y definición de "hecho"

- **Una tarea = una branch** (`/start` … `/done`).
- **Conventional commits:** `feat|fix|refactor|docs|test|chore|perf|ci: <descripción>`.
- **Definition of Done:** la del hub (`CLAUDE.md` §10).

---

## Ejemplos (bien / mal)

**Función — ≤2 parámetros posicionales, ≤50 líneas, una responsabilidad:**
```ts
// ❌ MAL: parámetros sueltos, hace dos cosas
function registrarPagoYNotificar(personaId, cajaId, monto, medio, enviarAviso) {}

// ✅ BIEN: objeto de input nombrado, una sola responsabilidad
interface RegistrarPagoInput { personaId: string; cajaId: string; monto: number; medioPago: MedioPago }
function registrarPago(input: RegistrarPagoInput) {}
```

**Fechas — siempre por el módulo `time`:**
```ts
// ❌ MAL                               // ✅ BIEN
const hoy = new Date();                 const hoy = todayBsAs();          // LocalDate
const ahora = Date.now();               const ahora = nowInstant();       // Instant
```

**Inmutabilidad:**
```ts
// ❌ MAL                               // ✅ BIEN
movimiento.estadoPago = 'pagado';       const next = { ...movimiento, estadoPago: EstadoPago.PAGADO };
```

---

## El anti-objetivo

- ❌ **No** es excusa para código descuidado: validación, manejo de errores y tests **siempre** van.
- ❌ **No** es abstraer todo "por las dudas" (eso viola YAGNI).
- ❌ **No** es prohibir crear: es **buscar primero, construir mínimo, ubicar bien**.

---

## Reglas base no negociables

- **Inmutabilidad**: nunca mutar in-place; devolver copias nuevas.
- **Archivos chicos**: 200-400 líneas típico, 800 máximo. Componentes ≤200, funciones ≤50.
- **TypeScript strict**: prohibido `any` sin justificar; type guards antes que `as`.
- **Servidor autoritativo**: las reglas de negocio (saldos, deudas, bonificaciones) se validan y
  calculan en el api; web nunca persiste un saldo calculado por su cuenta.
- **Validación en los bordes**: nunca confiar en datos externos.
- **Sin secretos hardcodeados**: variables de entorno.
- **Fecha/hora**: todo por `@scout/shared/time`; prohibido `new Date()` directo en lógica.
- **Testing — TDD, cobertura objetivo ≥80%**: unit (services, helpers, `time`), e2e del api solo
  con datos prefijados (`apps/api/test/README.md`), e2e de web con Playwright contra el api local.
