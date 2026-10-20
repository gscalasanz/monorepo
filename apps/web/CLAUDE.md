# CLAUDE.md — `apps/web` (Scout, Next.js)

Detalle **de web**. Lo transversal (producto, stack, reglas de código, fechas, invariantes de
dominio, seguridad de datos, DoD, commits) vive en el hub: [`../../CLAUDE.md`](../../CLAUDE.md).
Acá solo lo que es propio de esta app.

## Fuentes de verdad

| Tema | Documento |
| --- | --- |
| Estructura feature-based y sus 3 reglas | [`docs/estructura-frontend.md`](../../docs/estructura-frontend.md) (raíz) |
| Índice de lo reutilizable | [`REGISTRY.md`](../../REGISTRY.md) (raíz) + `REGISTRY-detail/` |
| Rarezas del backend ya relevadas | `docs/HALLAZGOS.md` |
| Design system de Scout (tokens, componentes, estados) | `docs/DESIGN.md` · `src/shared/styles/` |
| Catálogo offline de ReUI (fallback del MCP) | `docs/reui/` |
| Historia de la migración Angular → React (cerrada) | `MIGRATION.md` · `docs/MIGRATION-REPORT.md` |
| Contrato de la API | `apps/api` (mismo repo) + Swagger en `http://localhost:3001/api/docs` |

> La migración desde Angular está **terminada** (todos los módulos tachados en `MIGRATION.md`).
> El Angular de referencia (`frontend-deprecated`) quedó fuera del monorepo; lo que hace falta
> saber de él está en `docs/HALLAZGOS.md` y `docs/paridad/`.

---

## 1. Stack propio de web

| Capa | Elección |
| --- | --- |
| UI | **ReUI** (registry shadcn, style `base-nova`, `@base-ui/react`) + primitivos propios en `shared/components/ui` |
| Estilos | **Tailwind CSS 4** + tokens (`src/shared/styles/tokens.css`) + puente ReUI (`reui-bridge.css`) |
| Estado cliente | **zustand** (solo si el estado local de React no alcanza) |
| Validación | **zod** en el borde (forms y respuestas de API) |
| Tablas / gráficos / íconos | `@tanstack/react-table` vía `DataGrid` de ReUI · `recharts` · `lucide-react` |
| Animación | `gsap` solo donde aporte; respetar `prefers-reduced-motion` |
| Tests | Vitest + Testing Library + jsdom (unit) · Playwright (e2e) |
| Auth | JWT propio del api (`auth/login`, `auth/refresh`, `auth/logout`, `auth/me`): **no** better-auth |
| Dominio | Enums y `time` vienen de `@scout/shared`; `src/shared/domain/*/enums.ts` y `src/shared/time` los **re-exportan** con los nombres históricos de web (`RAMA`, `CAJA_TYPE`…) + `*_LABELS` y schemas zod |

## 2. Comandos

Desde la raíz: `pnpm --filter @scout/web <script>`; dentro de `apps/web`: `pnpm <script>`.

| Script | Qué hace |
| --- | --- |
| `dev` | Next en **http://localhost:4201** (puerto fijo: es el origin por defecto del CORS del api) |
| `build` · `lint` · `typecheck` · `test` | Pipeline de calidad (todo en verde) |
| `test:e2e` | Playwright contra `pnpm dev` + api local (`http://localhost:3001/api/v1`) |
| `design:apply <dirección>` | Regenera `tokens.css` y `docs/DESIGN.md` desde `design-directions/` |

> ⛔ **Nunca apuntar a la API de producción** desde dev ni e2e. Los e2e crean datos: solo
> contra el api local (y respetando las reglas de datos del hub §9).

## 3. Estructura

Feature-based + colocation: `src/app/` (solo routing), `src/features/<feature>/` (todo lo del
feature, `index.ts` como única puerta) y `src/shared/` (lo usado por 2+ features). Árbol real,
las 3 reglas y los dos niveles de `shared` en
[`docs/estructura-frontend.md`](../../docs/estructura-frontend.md).

Features: `auth`, `dashboard`, `personas`, `cajas`, `movimientos`, `inscripciones`,
`campamentos`, `eventos`, `event-report` (reporte público), `reportes`, `configuracion`.

## 4. ReUI primero — protocolo antes de crear un componente

1. Buscar en **`REGISTRY.md`** de la raíz (lo nuestro ya existente).
2. Si no está → buscar en **ReUI** con el MCP `reui` (`search` → `get_component` →
   `get_examples`) siguiendo la skill `.claude/skills/reui/SKILL.md`.
3. Instalar con el comando shadcn que devuelve el MCP (no interactivo). Después:
   - mover lo instalado a `src/shared/components/reui/` y reescribir imports;
   - **borrar** los `cssVars` que el instalador inyecta en `globals.css` y pisan tokens de marca
     (y su `@custom-variant dark`): el puente oficial es `reui-bridge.css`;
   - `validate_usage` antes de dar por bueno el uso (no inventar props).
4. Recién si ReUI no tiene nada razonable → componente propio en `shared/components/ui` o en el feature.
5. Todo lo reutilizable creado o instalado → **REGISTRY actualizado en el mismo commit**.

## 5. Reglas propias de web

Además de las del hub (§6):

- **Componentes** ≤200 líneas, uno por archivo. ESLint enforza `max-params` 2,
  `max-lines-per-function` 50 y `max-lines` 400 (off en tests/fixtures).
- **Copy** centralizado en `constants/` del feature o `shared/copy` (sin strings sueltos en JSX).
- **Fechas:** `@/shared/time` (re-exporta `@scout/shared/time` + `localDateSchema`/`instantSchema`).
- **Errores:** el `message` de NestJS (string o array unido con `". "`) se muestra tal cual vía
  `ApiError`; si no hay, fallback en español por status.
- **Server vs Client Components:** la app autentica con JWT en el cliente → las páginas bajo
  `(app)` son Client Components que consumen `shared/api`. Server Components para layout
  estático y el reporte público cuando aplique.
- **No importar de `apps/api`** (ESLint `monorepo-boundaries`): lo compartido va en `@scout/shared`.

## 6. Invariantes de comportamiento (heredados de Angular — no romper)

Los invariantes de **dominio** están en el hub (§8). Estos son de la app:

- **Auth:** access + refresh token en `localStorage`; el guard deja pasar si el access **o** el
  refresh es válido; refresh reactivo ante 401 con **cola** (una sola llamada a `auth/refresh`);
  si falla → `logout` (POST `auth/logout` fire-and-forget, limpiar tokens, ir a `/login`).
  `redirectUrl` en `sessionStorage` (default `/dashboard`). Cambiar password invalida sesiones.
- **HTTP:** retry con backoff exponencial (1s + jitter, 3 intentos): GET ante 502/503/504/0,
  mutaciones solo ante 503/0; nunca `auth/refresh`; no reintentar offline. Opt-out del error
  global por request (`skipGlobalError`).
- **Keep-alive:** ping al api tras 14 min de inactividad (Render free tier se duerme).
- **Reporte público** `/eventos/:id/reporte`: sin login; con sesión usa el endpoint
  autenticado; anónimo solo si el evento es público; 404 → "no disponible", sin toast global.
- **`vendedores-elegibles`** es el único listado que incluye la agrupación "Grupo Scout".
- **Montos de inscripción** en `localStorage` (`scout_inscripcion_config`): no cambiar la clave.
- **Cache** en memoria TTL 5 min / LRU 100 (`appCache`).
- **Dinero:** ARS `$ 1.234`, `-` si es null (`formatMoney`). Locale `es-AR`.

## 7. Design system

Contrato en `docs/DESIGN.md`. Tokens en `src/shared/styles/tokens.css` con **nombres fijos**
(`src/shared/styles/TOKENS-CONTRACT.md`); `reui-bridge.css` mapea los semánticos de shadcn a ese
contrato. Dark mode = `[data-theme='dark']` en `<html>`. `tokens.css` y `docs/DESIGN.md` **se
generan** con `pnpm design:apply <dirección>`: no editarlos a mano sin actualizar la dirección.
Las pantallas usan utilidades de tokens (`bg-surface`, `text-ink-muted`, `bg-rama-manada`…),
**nunca** colores de la paleta de Tailwind ni hex. Si falta un valor → se agrega el token.
Light + dark, colores por rama como tokens, mobile-first (touch ≥44px, body ≥16px, sin
overflow-x), AA, el estado nunca solo por color. Skills: `impeccable`, `frontend-design`,
`ui-ux-pro-max`, `tailwind-design-system`, `web-design-guidelines`.

## 8. Flujo del agente en web

**Antes de codear:** REGISTRY → ReUI (§4) → qué devuelve exactamente el endpoint (`apps/api` o
Swagger) → tipos/schemas zod primero → test primero.

**DoD extra de web** (además del hub §10):
- [ ] Tests unitarios de services/hooks/helpers; e2e Playwright si cambió un flujo principal.
- [ ] Verificado en navegador (Playwright MCP) a 390px y 1440px, light y dark, sin errores de consola.
- [ ] Sin imports cruzados entre features.

Herramientas: **codebase-memory** para entender código (web y api), **context7** para docs al
día de Next/React/Tailwind, **Playwright MCP** para verificar en navegador.
