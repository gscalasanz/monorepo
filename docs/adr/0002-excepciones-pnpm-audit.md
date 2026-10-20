# ADR 0002 — Excepciones del gate `pnpm audit --audit-level high`

- **Estado:** aceptado (revisar antes del 2026-11-20 o en el cutover, lo que llegue primero)
- **Fecha:** 2026-10-20
- **Contexto:** MONOREPO.md Fase 6

## Contexto

El job `security` de CI corre `pnpm audit --audit-level high`. Sobre el lockfile heredado de
los repos originales, el audit encontró 26 vulnerabilidades (6 high, 6 critical). Las de tooling
de dev transitivo se remediaron con `overrides` en `pnpm-workspace.yaml` (`handlebars`, vía
`eslint-plugin-boundaries`; `tinypool`, vía `vitest`), con la suite de web, la de
`@scout/config` y la de `@scout/shared` en verde después del cambio. Quedan tres:

| GHSA | Paquete | Ruta | Por qué no se remedió acá |
| --- | --- | --- | --- |
| GHSA-vcvr-r3jv-pc5j (critical, RCE en `next/og` `ImageResponse`) | `next` 16.3.5 | dependencia **directa** de `apps/web` | Requiere subir `next` a ≥16.3.8: cambia la versión que corre en producción. La consolidación tiene como regla "cero cambios de comportamiento". |
| GHSA-cjq9-62q9-8jv4 (high, SSRF en Image Optimization) | `next` 16.3.5 | ídem | ídem |
| GHSA-vfj7-8cjw-p6xm (high, DoS en `braces`) | `braces` ≤3.0.3 | `eslint-config-next` › … › `micromatch` | No hay versión parcheada (`patched_versions: <0.0.0`). Solo tooling de lint, nunca en runtime. |

Exposición real de las dos de `next` hoy: `apps/web` **no usa** `next/og` ni `ImageResponse`
(grep sin resultados), y `next.config.ts` no declara `images.remotePatterns` (solo
`next/image` con assets locales en `login-hero.tsx` y `sidebar-brand.tsx`). Son las mismas
vulnerabilidades que ya tiene hoy en producción `scout-front-react`, con la misma versión.

## Decisión

Ignorar exactamente esos tres GHSA en `package.json` → `pnpm.auditConfig.ignoreGhsas`. El umbral
(`high`) **no se baja** y cualquier advisory nuevo sigue rompiendo CI.

## Consecuencias

- El bump de `next` a ≥16.3.8 queda como **primera tarea recomendada** al usuario
  (MONOREPO.md §Bloqueos y `docs/MONOREPO-REPORT.md`). Es un commit `fix(web)` aislado, con
  `pnpm --filter @scout/web test`, `build` y e2e. Al hacerlo se quitan los dos GHSA de `next`
  de `ignoreGhsas`.
- `braces` sale de la lista cuando `eslint-config-next` deje de depender de `fast-glob`/`micromatch`
  o haya un parche. Dependabot lo va a proponer.
