# CLAUDE.md — Scout (monorepo)

Guía para Claude Code y cualquier agente/desarrollador que trabaje en este repo.
Es el **documento-hub**: lo esencial vive acá; el detalle, en los docs enlazados y en
`apps/*/CLAUDE.md`. Resistí engordarlo (ver `docs/flujo-confiable.md` L4).

## Fuentes de verdad

| Tema | Documento |
| --- | --- |
| Qué hace el sistema (producto, reglas de negocio) | [`docs/producto/PRD.md`](./docs/producto/PRD.md) (copia de la era Angular) |
| Requisitos técnicos originales (modelo de datos, API) | [`docs/producto/TRD.md`](./docs/producto/TRD.md) (copia de la era Angular) |
| Cómo escribir código (principios) | [`docs/principios-ingenieria.md`](./docs/principios-ingenieria.md) |
| Cómo se enforzan las reglas | [`docs/flujo-confiable.md`](./docs/flujo-confiable.md) |
| Estructura del frontend (`apps/web`) | [`docs/estructura-frontend.md`](./docs/estructura-frontend.md) |
| Estructura del backend (`apps/api`) | [`docs/estructura-backend.md`](./docs/estructura-backend.md) |
| Decisiones de arquitectura | [`docs/adr/`](./docs/adr/) (p. ej. `0001-representacion-enums.md`) |
| Estado de la consolidación del monorepo | [`MONOREPO.md`](./MONOREPO.md) |
| Índice de lo reutilizable | [`REGISTRY.md`](./REGISTRY.md) + `REGISTRY-detail/` |
| Detalle por app | [`apps/web/CLAUDE.md`](./apps/web/CLAUDE.md) · [`apps/api/CLAUDE.MD`](./apps/api/CLAUDE.MD) |
| Contrato HTTP vivo | Swagger del api en `http://localhost:3001/api/docs` (`/api/docs-json`) |

> Si una decisión de implementación no es obvia, se resuelve con `principios-ingenieria.md`.
> Si una regla de negocio no está clara, **se pregunta**: no se inventan reglas.

---

## 1. Producto en 3 líneas

Sistema de gestión financiera de un grupo scout: **personas** (protagonistas, educadores,
externas), **cajas** (grupo, fondos de rama, cuentas personales, fondo solidario),
**movimientos**, **inscripciones**, **campamentos**, **eventos** (venta y grupo, con reporte
público) y **reportes** (deudas). Usuarios: 1-3 administradores. Copy en español rioplatense.

---

## 2. Stack

| Capa | Elección |
| --- | --- |
| Monorepo | **pnpm 10 + Turborepo**, Node `>=24.15` (`.nvmrc` 24.19). `pnpm` obligatorio |
| Web (`apps/web`, `@scout/web`) | **Next.js 16 (App Router) + React 19 + TS strict**, ReUI (shadcn), Tailwind 4, zod, zustand, Vitest + Playwright |
| API (`apps/api`, `@scout/api`) | **NestJS 11 + TS**, TypeORM 0.3 (PostgreSQL), class-validator, Swagger, Jest |
| Auth | **JWT propio** (access + refresh) emitido por el api; `JwtAuthGuard` global + `@Public()` |
| Compartido | `@scout/shared` (enums de dominio + `time`), `@scout/config` (tsconfig + eslint) |
| Fechas | `date-fns` + `date-fns-tz`, solo vía `@scout/shared/time` |

---

## 3. Comandos de raíz

| Comando | Qué hace |
| --- | --- |
| `pnpm install` | Instala todo el workspace |
| `pnpm dev` | web (`:4201`) + api (`:3001`) en watch (turbo) |
| `pnpm build` · `pnpm lint` · `pnpm typecheck` · `pnpm test` | Pipeline por paquete (turbo, `^build` primero) |
| `pnpm --filter @scout/api <script>` | Script del api (`test:e2e`, `migration:run`, `seed`, `start:prod`…) |
| `pnpm --filter @scout/web <script>` | Script de web (`test:e2e`, `design:apply`…) |
| `pnpm --filter @scout/shared test` | Test de contrato de wire + tests de `time` |
| `pnpm setup:worktree` | En un worktree nuevo: symlinkea los `.env.local` del checkout principal y buildea `packages/*` |

`@scout/shared` compila a CJS (`dist/`): las apps lo consumen ya buildeado (turbo lo hace solo
con `^build`). Si lo editás y corrés una app aislada: `pnpm --filter @scout/shared build`.

---

## 4. Arquitectura de carpetas

```
apps/web/          Next.js: feature-based + colocation   → docs/estructura-frontend.md
apps/api/          NestJS: un módulo por dominio         → docs/estructura-backend.md
packages/shared/   @scout/shared: enums de dominio (./enums) + time (./time)
packages/config/   @scout/config: tsconfig base/nextjs/nestjs + eslint base/no-new-date/
                   feature-boundaries/monorepo-boundaries
docs/              principios · flujo-confiable · estructuras · adr · producto
```

**Regla de oro:** el **vocabulario de dominio que cruza el cable** (tipos de persona, ramas,
tipos de caja, conceptos de movimiento…) vive en `packages/shared` y lo importan **web y api**.
Una sola definición; cada app la re-exporta desde su punto histórico (ADR 0001). Nunca se
redefine un valor de wire en una app.

**Regla de promoción:** lo que usa **una sola app** se queda en esa app. Sube a
`packages/shared` **solo si hoy lo usan las dos**. Los `*_LABELS` (copy de UI) y los schemas
zod quedan en web; los DTOs con class-validator, en el api. No hay `packages/db` ni
`packages/auth`: no se crean "por si acaso".

**Fronteras (ESLint, `@scout/config`):** `packages/*` no importa de `apps/*`; `web` y `api` no
se importan entre sí; dentro de web, un feature no importa de otro.

---

## 5. REGISTRY y descubrimiento — buscá antes de crear

`REGISTRY.md` (índice alfabético) + `REGISTRY-detail/{domain,api,ui,testing}.md`. Crece
**on-miss**: solo se registra lo que existe y se reusa.

1. Buscar nombre/categoría en `REGISTRY.md` → si hay candidato, leer solo su detail.
2. Si existe → reutilizar/extender; **no duplicar**.
3. Si creás algo reutilizable → índice **y** detail actualizados **en el mismo commit**.

**Orden de herramientas:**
1. Entender **código** (símbolos, callers, impacto) → **codebase-memory primero**
   (`search_graph`, `search_code`, `trace_path`, `get_code_snippet`; si no está indexado,
   `index_repository`).
2. Texto / configs / markdown → **Grep/Glob**.
3. Barridos amplios (muchos dirs/convenciones) → subagente **Explore**.

---

## 6. Reglas de código (no negociables)

Detalle y ejemplos en [`docs/principios-ingenieria.md`](./docs/principios-ingenieria.md).

- **Idioma:** identificadores y archivos en inglés; copy al usuario en español rioplatense,
  centralizado. Los **valores de dominio** (`efectivo`, `Manada`, `scout_argentina`…) se respetan tal cual.
- **Sin magic strings/numbers:** `const` / objetos `as const`.
- **Funciones** ≤50 líneas, ≤2 params posicionales (3+ → objeto nombrado), una responsabilidad.
- **Archivos** 200-400 líneas típico, **800 máx** (web lo enforza en 400 con ESLint).
- **Inmutabilidad:** nunca mutar; devolver copias nuevas.
- **Sin `any`** (web: ESLint `error`; api: hoy `off` en ESLint → igual prohibido en código nuevo).
- **Imports** con alias/workspace (`@/…`, `@scout/shared/enums`), nunca `../../../`.
- **Errores nunca tragados:** fail fast; mensaje humano en español al usuario.

---

## 7. Convenciones transversales

- **Fechas — regla innegociable:** todo "ahora/hoy/día" pasa por `@scout/shared/time` (api) o
  `@/shared/time` (web, que lo re-exporta + schemas zod). Zona `America/Argentina/Buenos_Aires`
  (`BSAS_TIME_ZONE`, una sola definición). **Prohibido `new Date()` / `Date.now()` pelado**:
  regla ESLint `no-new-date` en `error` en web, api y packages.
  Branded `Instant` (ISO UTC) y `LocalDate` (`YYYY-MM-DD`).
- **Contrato HTTP:** respuestas crudas (sin envelope), prefijo `/api/v1`, errores de NestJS
  (`message` string o array). El api **no** cambia su contrato sin acordarlo: el test de
  contrato (`packages/shared/test/wire-contract.test.ts`) y Swagger son el control.
- **Errores:** web muestra el `message` de NestJS (array unido con `". "`) o un fallback por
  status; api lanza excepciones HTTP de Nest con mensaje en español.
- **Commits:** conventional commits, tipos `feat|fix|refactor|docs|test|chore|perf|ci`
  (commitlint; nada de `style`/`build`/`revert`). Scope = módulo/paquete (`api`, `web`,
  `shared`, `personas`, `cajas`…).

---

## 8. Invariantes de dominio

Fuente: `docs/producto/PRD.md` §4 + el código. No cambiar sin confirmación del usuario.

- **`saldoActual` nunca se persiste:** se calcula siempre desde los movimientos.
- **Fondo Solidario es una caja aparte** (`CajaType.FONDO_SOLIDARIO`): su plata no es de la caja
  grupo; solo entra al otorgar una bonificación.
- **Las bonificaciones son transferencias reales** (movimientos de ida y vuelta), no descuentos.
- **Eventos de venta registran ganancia, no recaudación.**
- **Personas deshabilitadas:** visibles en listados, historial y deudas; **ocultas en
  selectores** (`soloActivos`).
- **Personas = Single Table Inheritance** (`personas.tipo`: protagonista, educador, externo,
  agrupación). `PersonaType.EXTERNA = 'externo'`.
- **Soft delete** (`deletedAt` de `BaseEntity`); no se borra lo que tiene movimientos
  (`DeletionValidatorService`): los movimientos son el libro contable.
- `cuota_grupo` y el módulo Cuotas **ya no existen**.

---

## 9. Seguridad de datos (no negociable)

- **Prohibido ejecutar o crear nada que borre datos en una base** (`DELETE` sin `WHERE`,
  `TRUNCATE`, `dropSchema`, `db:test:reset` contra algo que no sea el contenedor de test…).
  Única excepción: datos de test **con prefijo propio**, creados y limpiados en el mismo spec.
- `AppModule` lee **`apps/api/.env.local`** y corre con **`migrationsRun: true`**: cualquier
  e2e (`test:e2e`) o el `benchmark` se conecta a la base de esa config (compartida, no la de
  Docker) y **le aplica las migraciones pendientes**. Reglas completas en
  [`apps/api/test/README.md`](./apps/api/test/README.md).
- Nunca correr migraciones ni e2e contra producción. Nunca apuntar web a la API de producción.
- Nunca leer ni commitear `.env*`; sin secretos en el código.

---

## 10. Definition of Done

- [ ] `pnpm typecheck` + `pnpm lint` + `pnpm test` en verde (y `build` si tocó build/config).
- [ ] Test primero (TDD); e2e de web si cambió un flujo; e2e del api solo con datos prefijados.
- [ ] Sin `any`, sin magic values, sin `new Date()` suelto, sin imports cruzados.
- [ ] Contrato HTTP intacto (o cambio acordado y reflejado en web + `@scout/shared`).
- [ ] Copy en español; identificadores en inglés.
- [ ] REGISTRY actualizado en el mismo commit si se tocó algo reutilizable.
- [ ] UI: verificada en 390px y 1440px, light y dark (ver `apps/web/CLAUDE.md`).

---

## 11. Flujo del agente

1. Leer este hub y el `CLAUDE.md` de la app que se toca.
2. REGISTRY → codebase-memory → decidir ubicación (§4, regla de promoción).
3. Tipos primero (enums de `@scout/shared`, DTO del api, schema zod de web) → test → código.
4. Correr el DoD (§10). Un commit convencional por cambio coherente.
5. Una branch por tarea (`/start` … `/done`). No pushear ni commitear sin pedido explícito.
