# CLAUDE.md — Scout Frontend (React)

Guía para Claude Code y cualquier agente que trabaje en este repo. Documento-hub: lo esencial
vive acá; el detalle, en los docs enlazados. **Adaptado de las reglas de mi-tienda**
(`/Users/martinoficialdegui/Desktop/mi-tienda`): ante una duda de criterio que este archivo no
resuelva, se resuelve como lo resuelve mi-tienda (`docs/principios-ingenieria.md`,
`docs/estructura-frontend.md`, `docs/flujo-confiable.md`).

## Fuentes de verdad

| Tema | Documento |
| --- | --- |
| Estado de la migración (qué está hecho, qué falta) | `MIGRATION.md` |
| Rarezas del backend/Angular ya relevadas (leer antes de cada módulo) | `docs/HALLAZGOS.md` |
| Catálogo offline de ReUI (fallback del MCP) | `docs/reui/` |
| Design system de Scout (tokens, componentes, estados) | `docs/DESIGN.md` · `src/app/globals.css` |
| Índice de lo reutilizable | `REGISTRY.md` + `REGISTRY-detail/<categoría>.md` |
| Comportamiento de referencia (paridad funcional) | `../frontend/` (Angular 21, **solo lectura**) |
| Contrato de la API | `../backend/` (NestJS, **solo lectura**) + Swagger en `http://localhost:3001/api` |

> **Scope guard:** esto es una **migración con paridad funcional + rediseño visual**. No se agregan
> features, no se cambian reglas de negocio y **no se toca `../backend` ni `../frontend`**. Si algo
> parece requerir un cambio de backend → anotarlo en `MIGRATION.md §Bloqueos` y seguir con otra cosa.

---

## 1. Producto

Sistema de gestión financiera de un grupo scout: personas (protagonistas, educadores, externos),
cajas (grupo, fondos de rama, cuentas personales, fondo solidario), movimientos, inscripciones,
campamentos, eventos (venta y grupo, con reporte público), reportes y configuración.
Copy al usuario en **español rioplatense**.

## 2. Stack (idéntico a mi-tienda salvo lo marcado)

| Capa | Elección |
| --- | --- |
| Framework | **Next.js 16 (App Router) + React 19.2 + TS strict** |
| UI | **ReUI** (registry shadcn, style `base-nova`, `@base-ui/react`) + primitivos propios en `shared/components/ui` |
| Estilos | **Tailwind CSS 4** con tokens propios (`docs/DESIGN.md`) + puente ReUI (`src/shared/styles/reui-bridge.css`) |
| Estado cliente | **zustand** (solo si el estado local de React no alcanza) |
| Validación | **zod 3** (forms y respuestas de API en el borde) |
| Tablas | **@tanstack/react-table** vía `DataGrid` de ReUI |
| Gráficos | **recharts** (reemplaza chart.js/ng2-charts) |
| Íconos | **lucide-react** (reemplaza mat-icon) |
| Fechas | **date-fns + date-fns-tz**, solo a través de `src/shared/time` (zona `America/Argentina/Buenos_Aires`) |
| Animación | **gsap** solo donde aporte; respetar `prefers-reduced-motion` |
| Tests | **Vitest + Testing Library + jsdom** (unit) · **Playwright** (e2e) |
| Auth | ⚠️ **NO better-auth**: el backend emite JWT propio (`auth/login`, `auth/refresh`, `auth/logout`, `auth/me`). Se replica el flujo de Angular. |
| Monorepo | ⚠️ **NO turbo/pnpm workspaces**: es una sola app. Lo que en mi-tienda vive en `packages/shared` acá vive en `src/shared/domain`. |

**Gestor: `pnpm` obligatorio.** Node según `.nvmrc` (mismo que mi-tienda).

## 3. Comandos

| Comando | Qué hace |
| --- | --- |
| `pnpm dev` | Next en **http://localhost:4201** (puerto fijo: es el único origin que acepta el CORS del backend) |
| `pnpm build` · `pnpm lint` · `pnpm typecheck` · `pnpm test` | Pipeline de calidad (todos deben quedar en verde) |
| `pnpm test:e2e` | Playwright contra `pnpm dev` + backend local (`http://localhost:3001/api/v1`) |

> ⛔ **Nunca apuntar a la API de producción** (`scout-back-k56p.onrender.com`) desde dev ni e2e.
> Los e2e crean y borran datos: solo contra el backend local (DB de test/dev).

## 4. Estructura (feature-based + colocation, igual que mi-tienda)

```
src/
  app/                    # SOLO routing (capa fina): page.tsx ~10 líneas que importan del feature
    (auth)/login/
    (app)/                # layout autenticado con AppShell + guard de sesión
      dashboard/ personas/ cajas/ movimientos/ inscripciones/ campamentos/ eventos/ reportes/ configuracion/
    (public)/eventos/[id]/reporte/   # reporte público, sin AppShell ni guard
  features/<feature>/
    components/ hooks/ services/ stores/ models/ helpers/ constants/
    index.ts              # API pública: único import válido desde afuera
  shared/
    domain/               # enums, tipos de dominio, schemas zod de la API (equivale a packages/shared)
    api/                  # api-client (fetch), refresh de token, retry, keep-alive, ApiError
    auth/                 # sesión, token storage, useSession, guard
    time/                 # único lugar donde se construyen fechas
    components/ui/        # primitivos de marca (Button, Input, …)
    components/reui/      # VENDORIZADO (ReUI). No se edita salvo parches `PATCH Scout`
    forms/                # kit de validación (useFieldValidation + collectFieldErrors, como mi-tienda)
    hooks/ helpers/ constants/ copy/
    lib/utils.ts          # `cn`
```

**Las 3 reglas (enforzadas con ESLint `eslint-plugin-boundaries`, copiado de mi-tienda
`packages/config/eslint/feature-boundaries.mjs`):**
1. Un feature **no importa de otro feature**. Si dos lo necesitan → se promueve a `shared`.
2. El `index.ts` del feature es **la única puerta**.
3. `app/` es fina y descartable: sin lógica de negocio.

Features (uno por módulo Angular): `auth`, `dashboard`, `personas`, `cajas`, `movimientos`,
`inscripciones`, `campamentos`, `eventos`, `event-report` (reporte público), `reportes`, `configuracion`.

## 5. ReUI primero — protocolo obligatorio antes de crear un componente

1. Buscar en **`REGISTRY.md`** (lo nuestro ya existente).
2. Si no está → buscar en **ReUI** con el MCP `reui` (`search` → `get_component` → `get_examples`)
   siguiendo la skill `.claude/skills/reui/SKILL.md`. Componentes, bloques, examples e íconos.
3. Instalar con el comando shadcn que devuelve el MCP (no interactivo). Después:
   - mover lo instalado a `src/shared/components/reui/` y reescribir imports;
   - **borrar** los `cssVars` que el instalador inyecta en `globals.css` y pisan tokens de marca
     (y su `@custom-variant dark`): el puente oficial es `reui-bridge.css`;
   - `validate_usage` antes de dar por bueno el uso (no inventar props).
4. Recién si ReUI no tiene nada razonable → componente propio en `shared/components/ui` o en el feature.
5. Todo lo reutilizable creado o instalado → **REGISTRY actualizado en el mismo commit**.

Adaptar por reuso: datos reales, tokens de marca, mantener la estructura del bloque. No rediseñar
lo que ReUI ya resuelve.

## 6. Reglas de código (NO negociables)

- **Idioma:** identificadores y archivos en inglés; copy al usuario en español, centralizado en
  `constants/` / `shared/copy` (sin strings sueltos en JSX). Los **valores de dominio que vienen del
  backend** (`efectivo`, `scout_argentina`, `PROTAGONISTA`, `Manada`…) se respetan tal cual.
- **TS strict:** prohibido `any` (ESLint `error`); type guards antes que `as`.
- **Sin magic strings/numbers:** a `const` / `as const` (TTL de cache, intervalos de keep-alive,
  reintentos, tamaños de página, endpoints).
- **Funciones** ≤50 líneas, ≤2 params posicionales (3+ → objeto). **Componentes** ≤200 líneas, uno
  por archivo. **Archivos** 200-400 típico, 800 máx.
- **Inmutabilidad** siempre. **Imports** con alias `@/…`, nunca `../../../`.
- **Fechas:** prohibido `new Date()` / `Date.now()` fuera de `src/shared/time` (ESLint, copiado de
  mi-tienda `no-new-date.mjs`).
- **Errores:** nunca tragar. Mensaje humano en español al usuario (toast/inline); el mensaje de
  NestJS (`message`, string o array unido con ". ") se respeta como hoy lo hace `ErrorHandlerService`.
- **Server vs Client Components:** la app es autenticada con JWT en el cliente → las páginas bajo
  `(app)` son Client Components que consumen `shared/api`. Server Components para layout estático
  y el reporte público cuando aplique.

## 7. Invariantes heredados de Angular (paridad — no romper)

- **Auth:** access + refresh token en `localStorage`; guard deja pasar si el access **o** el refresh
  es válido; refresh reactivo ante 401 con **cola** de requests concurrentes (una sola llamada a
  `auth/refresh`); si falla → `logout` (POST `auth/logout` fire-and-forget, limpiar tokens, ir a
  `/login`). `redirectUrl` en `sessionStorage` y vuelta post-login (default `/dashboard`). Cambiar
  password invalida sesiones → forzar login.
- **HTTP:** retry con backoff exponencial (1s + jitter, 3 intentos): GET ante 502/503/504/0,
  mutaciones solo ante 503/0; nunca `auth/refresh`; no reintentar offline. Opt-out del error global
  por request (equivalente a `SKIP_GLOBAL_ERROR`).
- **Keep-alive:** ping al backend tras 14 min de inactividad (Render free tier se duerme).
- **Reporte público** `/eventos/:id/reporte`: accesible sin login; con sesión usa el endpoint
  autenticado; anónimo solo si el evento es público; 404 → "no disponible", sin toast global.
- **Personas deshabilitadas:** visibles en listados, historial y deudas; **ocultas en selectores**
  (endpoint con `soloActivos`).
- **`vendedores-elegibles`** es el único listado que incluye la agrupación "Grupo Scout".
- **Montos de inscripción** (Scout Argentina / grupo) viven en `localStorage`
  (`scout_inscripcion_config`) — mantener la misma clave para no perder la config de los usuarios.
- **Cache** en memoria con TTL 5 min / LRU 100 para lo que hoy cachea `CacheService`.
- **Formato de dinero:** ARS `$ 1.234`, `-` si es null (pipe `money`). `LOCALE es-AR`.
- **Fondo Solidario** es caja aparte; las bonificaciones son transferencias reales; los ingresos de
  eventos de venta registran **ganancia**, no recaudación.
- `cuota_grupo` y el módulo Cuotas **ya no existen**: no se migran.

## 8. Design system

Contrato en `docs/DESIGN.md` (aprobado por el usuario antes de la migración). Tokens en
`src/shared/styles/tokens.css`, con **nombres fijos** definidos en
`src/shared/styles/TOKENS-CONTRACT.md`; `reui-bridge.css` mapea los semánticos de shadcn a ese
contrato. Dark mode = `[data-theme='dark']` en `<html>` (variante `dark:` ya configurada).
`tokens.css` y `docs/DESIGN.md` **se generan** con `pnpm design:apply <dirección>` desde
`design-directions/`: no editarlos a mano sin actualizar también la dirección de origen. Las
pantallas usan utilidades de tokens (`bg-surface`, `text-ink-muted`, `bg-rama-manada`…), **nunca**
colores de la paleta de Tailwind (`bg-red-500`) ni hex. Si falta un valor → se agrega el token, **no se hardcodea**. Light + dark. Colores por rama (Manada, Unidad,
Caminantes, Rovers) como tokens. Mobile-first: touch ≥44px, body ≥16px, sin overflow-x.
Accesibilidad AA; el estado nunca se comunica solo por color. Skills: `impeccable`,
`frontend-design`, `ui-ux-pro-max`, `tailwind-design-system`, `web-design-guidelines`.

## 9. Flujo de trabajo del agente

**Antes de escribir código:** REGISTRY → ReUI (§5) → Angular de referencia (qué hace exactamente
la pantalla) → backend (qué devuelve exactamente el endpoint) → tipos/schemas zod primero → test primero.

**Definition of Done de cada módulo** (no se tacha en `MIGRATION.md` hasta que):
- [ ] Todas las rutas, acciones y reglas del checklist de paridad del módulo funcionan.
- [ ] `pnpm typecheck` + `pnpm lint` + `pnpm test` + `pnpm build` en verde.
- [ ] Tests unitarios de services/hooks/helpers y un e2e Playwright del flujo principal contra el backend local.
- [ ] Verificado en navegador (Playwright MCP) a 390px y 1440px, light y dark, sin errores de consola.
- [ ] Sin `any`, sin magic values, sin `new Date()` suelto, sin imports cruzados entre features.
- [ ] REGISTRY actualizado; `MIGRATION.md` actualizado; **un commit convencional por módulo**
      (`feat(<modulo>): migrar <modulo> a React`).

Herramientas de descubrimiento: **codebase-memory** para entender el código Angular/NestJS (indexar
`../frontend` y `../backend` si no están), Grep/Glob para texto, subagente Explore para barridos
amplios. **context7** para docs al día de Next/React/Tailwind. **Playwright MCP** para verificar en navegador.
