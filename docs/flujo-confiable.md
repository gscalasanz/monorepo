# Flujo Confiable — cómo se hacen cumplir las reglas

> Cómo lograr que "lo correcto pase siempre" sin depender de que el agente (o un humano) se
> acuerde de seguir la convención. Complementa [`principios-ingenieria.md`](./principios-ingenieria.md)
> (qué reglas) y [`../CLAUDE.md`](../CLAUDE.md) (el contrato del proyecto). Adaptado de
> `mi-tienda/docs/flujo-confiable.md`, marcando qué tiene Scout **hoy** y qué queda diferido.

---

## Tesis

**La confiabilidad es una propiedad del entorno, no del modelo.** No se resuelve pidiéndole al
agente que "se acuerde": se diseña el entorno para que el resultado correcto ocurra aunque el
agente falle la decisión. Por eso el hook **no** es la primera herramienta: es la tercera.

| Causa de que no se sigan las reglas | Ataque correcto |
| --- | --- |
| **Discrecionalidad** (toda decisión del modelo falla a veces) | Mover la garantía a algo no discrecional: tipos, lint, CI |
| **Dilución de contexto** (un `CLAUDE.md` gigante empeora todo) | Contexto lean (hub + links) + detalle por app |
| **Ausencia del trigger al decidir** | Comandos/scaffolds que traen el camino armado (diferido) |

---

## La escalera de palanca (de más fuerte a más débil)

Leyenda: ✅ hoy · 🟡 parcial · ⏳ planificado (MONOREPO.md) · 💤 diferido (YAGNI, on-miss)

### L1 — Sistema de tipos y schemas

| Mecanismo | Estado | Dónde |
| --- | --- | --- |
| `Instant` / `LocalDate` branded: un string cualquiera no entra donde va "día de negocio" | ✅ | `packages/shared/src/time/branded.ts` |
| Vocabulario de dominio único (`as const` + tipo), compartido por web y api | ✅ | `packages/shared/src/enums/` (ADR 0001) |
| Test de contrato de wire: cada enum contra el snapshot del backend original | ✅ | `packages/shared/test/wire-contract.test.ts` |
| Schemas zod en cada lectura de web (respuesta fuera de contrato = error explícito) | ✅ | `apps/web/src/shared/domain/*/schemas.ts` + `apiClient` |
| DTOs class-validator + `ValidationPipe` global estricto en el api | ✅ | `apps/api/src/main.ts` |
| Tipo nominal de enum en el api | — | Se perdió al pasar a `as const` (ADR 0001, aceptado) |

### L2 — Determinismo que viaja con el repo

Los hooks de `.claude/` son por desarrollador: la garantía durable **vive en el repo**.

| Mecanismo | Estado | Dónde / nota |
| --- | --- | --- |
| ESLint `monorepo-boundaries`: `packages/*` ↛ `apps/*`, `web` ↛ `api`, `api` ↛ `web` | ✅ | `packages/config/eslint/monorepo-boundaries.mjs` (con tests `node --test`) |
| ESLint `feature-boundaries` en web (las 3 reglas) | 🟡 | `packages/config/eslint/feature-boundaries.mjs`. Solo chequea imports **relativos**: los `@/features/...` no se resuelven (MONOREPO.md §Deuda) |
| ESLint `no-new-date` | 🟡 | web `error`; api `warn` hasta MONOREPO.md Fase 8; packages `error` |
| Límites de tamaño (`max-params` 2, funciones 50, archivos 400) | 🟡 | Solo web (`apps/web/eslint.config.mjs`); el api no los enforza |
| `no-explicit-any` | 🟡 | web `error`; api `off` |
| husky + lint-staged + commitlint (`feat\|fix\|refactor\|docs\|test\|chore\|perf\|ci`) | ⏳ | MONOREPO.md Fase 6. Hoy existen `apps/web/.husky`, `.lintstagedrc.mjs` y `commitlint.config.mjs` heredados del repo de web, pero **no corren** en el monorepo (los hooks de git no apuntan ahí) |
| CI en el PR (quality: typecheck/lint/test/build · security) + dependabot | ⏳ | MONOREPO.md Fase 6 (`.github/workflows/ci.yml`) |
| Lint del api en verde | ⏳ | Hoy ~465 errores preexistentes (MONOREPO.md §Baseline/§Deuda) |
| Hooks locales de `.claude` (formato) | ✅ | `apps/web/.claude/settings.json` + `hooks/format-edited-file.sh` (acelerador, no garantía) |

### L3 — Scaffolding y comandos — 💤 diferido

Generadores de módulo Nest / pantalla de web y slash commands con el camino armado. Se
construyen recién si escribir módulos a mano muestra repetición real (regla de tres). Hoy hay
`/start` y `/done` para el ciclo de tarea.

### L4 — Ingeniería de contexto

| Mecanismo | Estado |
| --- | --- |
| `CLAUDE.md` hub lean + `apps/*/CLAUDE.md` con el detalle | ✅ |
| `REGISTRY.md` + `REGISTRY-detail/` como índice de recuperación | ✅ |
| codebase-memory para entender código; subagentes Explore para barridos | ✅ |
| Hook `UserPromptSubmit` que inyecta la tajada relevante del contrato | 💤 |

### L5 — Feedback y aprendizaje — 💤 diferido

DoD como **script** (tamaños, REGISTRY sincronizado, `new Date()` suelto), evals del agente,
telemetría de skills, `Stop` hook con re-inyección de errores. Hoy el DoD es un checklist
(`CLAUDE.md` §10). Cada miss real se convierte en un guard nuevo (grow-on-miss).

---

## Guardrails de dominio de Scout (máximo ROI de correctitud)

- **Módulo `time`:** toda lógica de "ahora/hoy/día" pasa por `@scout/shared/time` (zona AR fija,
  branded). `dayFilterBounds` para rangos de días hacia el api. `dateOnlyTransformer` para
  columnas `date`.
- **Saldo derivado:** `saldoActual` nunca se persiste; se calcula desde movimientos.
- **Libro contable:** no se borra lo que tiene movimientos (`DeletionValidatorService`); el
  borrado es soft delete.
- **Contrato de wire congelado:** test de contrato + OpenAPI de Swagger como referencia; un
  cambio de valor de enum rompe el test.
- **Seguridad de datos en tests:** e2e prefijados, cleanup inline, nada de `DELETE` masivo
  (`apps/api/test/README.md`). `AppModule` corre migraciones al levantar.

---

## Meta-principio: el harness también obedece YAGNI

Construir una fortaleza de hooks + evals + codegen antes de necesitarla es la sobre-ingeniería
que `principios-ingenieria.md` prohíbe. Núcleo mínimo (L1 + L2) y cada miss real se convierte
en un guard permanente.
