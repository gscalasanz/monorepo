# Estructura del Frontend — Scout (`apps/web`)

> Cómo se organiza el código de la app Next.js. Extiende la regla de promoción de
> [`principios-ingenieria.md`](./principios-ingenieria.md) y la enforcement de
> [`flujo-confiable.md`](./flujo-confiable.md). El backend está en
> [`estructura-backend.md`](./estructura-backend.md). Adaptado de `mi-tienda/docs/estructura-frontend.md`.

---

## Principio: feature-based + colocation

**Todo lo de un feature vive dentro de su carpeta** (componentes, services, hooks, modelos,
helpers, constantes). La prueba de fuego:

> **Si mañana hay que discontinuar un feature, se borra su carpeta (+ sus rutas en `app/`) y
> nada más se rompe.**

---

## Estructura real

```
apps/web/src/
  app/                          Next.js App Router — SOLO routing (capa fina)
    layout.tsx · globals.css · not-found.tsx · page.tsx
    (auth)/login/
    (app)/                      layout.tsx = SessionGate + NavigationTracker + AppShell
      dashboard/ personas/ cajas/ movimientos/ inscripciones/ campamentos/
      eventos/ reportes/ configuracion/
    (public)/eventos/[id]/reporte/   reporte público, sin AppShell ni guard
  features/<feature>/           auth · dashboard · personas · cajas · movimientos · inscripciones
                                campamentos · eventos · event-report · reportes · configuracion
    components/ hooks/ services/ models/ helpers/ constants/   (solo las que hagan falta)
    index.ts                    API pública: único import válido desde afuera
  shared/                       lo usado por 2+ features de web
    api/          cliente HTTP (fetch), refresh, retry, keep-alive, ApiError, endpoints
    auth/         sesión JWT, tokens, guards, hooks
    cache/        appCache (TTL + LRU)
    components/
      ui/         primitivos de marca (Button, Panel, form/…)
      data/       AppDataGrid, Money, StatusBadge, FilterBar, ListPanel…
      charts/     recharts con tokens
      feedback/   EmptyState, LoadingState, ErrorState, NotFoundView
      finanzas/   piezas de movimientos que comparten campamentos y eventos
      reui/       VENDORIZADO (ReUI/shadcn)
    confirm/ notifications/ layout/ navigation/ theme/
    domain/       re-export de @scout/shared/enums + *_LABELS + schemas zod + dtos, por dominio
    time/         re-export de @scout/shared/time + schemas zod de fecha
    constants/ copy/ format/ forms/ hooks/ lib/ queries/ settings/ storage/ styles/ validators/
```

Ejemplo de ruta fina (`app/(app)/dashboard/page.tsx`):

```tsx
import { DashboardView } from '@/features/dashboard';

export default function DashboardPage() {
  return <DashboardView />;
}
```

### Componentes vendorizados (ReUI)

`shared/components/reui/` es código de terceros (registry shadcn, `apps/web/components.json`):

- **No se edita a mano** salvo para que compile con TS strict; los parches van marcados
  `PATCH Scout` (una reinstalación los pisa).
- Está **excluido del lint** (`apps/web/eslint.config.mjs`); sí pasa por `typecheck`.
- Tras instalar: mover a `shared/components/reui/`, reescribir imports y borrar los `cssVars`
  que el instalador inyecta en `globals.css` (el puente es `shared/styles/reui-bridge.css`).
- Las pantallas usan los primitivos de marca (`shared/components/ui/*`) y los compuestos de
  `shared/components/{data,charts,feedback}` antes que el ReUI crudo.

Protocolo completo en `apps/web/CLAUDE.md` §4.

---

## Las 3 reglas (enforzadas por `@scout/config/eslint/feature-boundaries`)

**1. Un feature NO importa de otro feature.** Solo de sí mismo, de `src/shared` y de
`@scout/shared`. Si dos features necesitan lo mismo → se promueve a `shared`.
(`boundaries/element-types`: `feature → [mismo feature, shared]`, `shared → shared`.)

**2. El `index.ts` del feature es la única puerta.** Desde afuera se importa
`@/features/personas`, nunca `@/features/personas/components/...`.
(`boundaries/entry-point`: de un feature solo `index.ts`/`index.tsx`.)

**3. `app/` es fina y descartable.** Un archivo de ruta importa la vista del feature y la
renderiza; sin lógica de negocio. (`app → [feature, shared]`.)

> ⚠️ **Límite conocido:** el plugin resuelve imports con el resolver `node`, así que hoy solo
> chequea imports **relativos**; los que usan el alias `@/features/...` no se verifican
> (MONOREPO.md §Deuda). La regla igual aplica: el lint no es la regla, es la red.

Además, `@scout/config/eslint/monorepo-boundaries` (`webPreset`) prohíbe importar de `apps/api`
(`@scout/api` o rutas `**/apps/api/**`).

---

## Los DOS niveles de "shared" (no confundir)

| Nivel | Qué vive | Lo comparten |
| --- | --- | --- |
| **`packages/shared`** (`@scout/shared`) | Vocabulario de dominio que cruza el cable (enums `as const`, ADR 0001) y el módulo `time` (sin zod) | web **y** api |
| **`apps/web/src/shared`** (`@/shared/...`) | Adaptadores con nombres de web (`RAMA`, `CAJA_TYPE`…), `*_LABELS`, schemas zod, cliente HTTP, auth, componentes del design system, hooks, formato | features de web |

- Un valor de enum se define **solo** en `packages/shared/src/enums/`; `src/shared/domain/*/enums.ts`
  lo re-exporta. Nunca se redefine en web.
- Fechas: siempre `@/shared/time` (re-exporta `@scout/shared/time` + `localDateSchema`/`instantSchema`).
- En `features/<x>/models/` solo van view-models o schemas propios del feature (p. ej. schemas
  de formularios), no modelos de dominio.

---

## Promoción (de feature → shared)

Algo **nace dentro del feature**. Cuando un 2º feature lo necesita:
1. Se **mueve** a `apps/web/src/shared` (o a `packages/shared` si también lo usa el api hoy).
2. Se actualizan los imports.
3. Se **registra** en `REGISTRY.md` en el mismo commit.

Nunca se copia entre features. Ejemplo real: `personaDeudaSchema` subió a
`shared/domain/reporte/deudas.ts` porque lo usan `reportes` y `dashboard`; los filtros de
deuda siguen en `features/reportes`.

---

## Validación de formularios (estándar)

Todo form usa el mismo kit (`@/shared/forms` + `@/shared/components/ui/form`; ver
`REGISTRY-detail/ui.md`):

- **Un schema zod por form** (en el feature), con validadores de `@/shared/validators` vía `refineWith`.
- **`useFieldValidation(schema)`**: error on-blur, se limpia al reescribir, válido en vivo;
  `validateAll(values)` es el gate del submit.
- **Accesibilidad:** `aria-invalid` + mensaje con `role="alert"`/`aria-describedby`; el estado
  nunca solo por color.

Si falta un caso → **extendé el kit**, no lo dupliques.
