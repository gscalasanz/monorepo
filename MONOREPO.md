# MONOREPO — bitácora y checklist de la consolidación

Fuente de verdad del avance. Se tacha un ítem **solo** con evidencia: el comando corrido y su salida en verde.
Al retomar: leer este archivo, `CLAUDE.md` y `git log --oneline -20`, y seguir en el primer `- [ ]`.

Plan: `~/.claude/plans/validated-questing-cat.md` · Objetivo: `scout/docs/monorepo/GOAL.md`.

## Checklist

### Fase 0 — Pre-vuelo y baseline
- [x] Estado de los repos originales relevado (§Pendientes del usuario); punto de corte anotado
- [x] Baseline backend (§Baseline)
- [x] Baseline frontend (§Baseline)
- [x] Inventario de duplicación (§Inventario)
- [x] Snapshot de contrato `packages/shared/test/fixtures/wire-values.snapshot.json`

### Fase 1 — Consolidación git con historial
- [ ] `apps/api` importado con historial (filter-repo, clon fresco)
- [ ] `apps/web` importado con historial (filter-repo, clon fresco)
- [ ] Verificación: conteo de commits, `log --follow`, `blame`

### Fase 2 — Workspace pnpm + Turborepo
- [ ] Raíz: `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `.nvmrc` 24.19
- [ ] Paquetes renombrados `@scout/api`, `@scout/web`
- [ ] `apps/api` de npm a pnpm (versiones efectivas anotadas, sin `shamefully-hoist`)
- [ ] Scripts uniformes (`dev`, `build`, `lint`, `lint:fix`, `typecheck`, `test`, `test:e2e`)
- [ ] api buildea y testea con Node 24
- [ ] `pnpm dev` levanta web:4201 y api:3001
- [ ] code-reviewer de la fase

### Fase 3 — `packages/config`
- [ ] tsconfig `base`/`nextjs`/`nestjs`
- [ ] eslint `base`, `no-new-date`, `feature-boundaries`, `monorepo-boundaries` con tests
- [ ] `apps/web` consume presets sin cambio de reglas
- [ ] `apps/api` adopta `monorepo-boundaries` + `no-new-date` (warn) + tsconfig `nestjs` con `dist/src/main.js` intacto

### Fase 4 — `packages/shared`
- [ ] Paquete CJS con `exports` `.`, `./enums`, `./time`
- [ ] Test de contrato contra el snapshot (primero, en rojo)
- [ ] Spike de paridad Nest (`@IsEnum`, Swagger, TypeORM) + ADR de representación
- [ ] Dominios: persona · caja · movimiento · inscripción · campamento · evento · reporte
- [ ] `migration:generate` sin archivo
- [ ] `time` movido; `APP_TIMEZONE` única
- [ ] code-reviewer de la fase

### Fase 5 — Gobierno
- [ ] `CLAUDE.md` hub + `apps/*/CLAUDE.md` como detalle
- [ ] `REGISTRY.md` + `REGISTRY-detail/{domain,api,ui,testing}.md`
- [ ] `docs/` (principios, flujo-confiable, estructura-frontend, estructura-backend, producto)
- [ ] `scripts/setup-worktree.sh`
- [ ] `.claude/settings.json` + hooks; skills evaluadas

### Fase 6 — Gates de calidad
- [ ] husky + lint-staged + commitlint
- [ ] `.github/workflows/ci.yml` (quality + security) + `dependabot.yml`
- [ ] Lint del api en verde (fix o ADR)
- [ ] code-reviewer de la fase

### Fase 7 — Deploy (preparado, no ejecutado)
- [ ] `docs/deploy.md` (Vercel, Render, checklist post-cutover, plan de remotos)

### Fase 8 — Fechas en el api
- [ ] Inventario §Fechas
- [ ] `@scout/shared/time` completado con TDD
- [ ] Clase A migrada
- [ ] Clase C migrada
- [ ] Clase B corregida (test rojo → verde)
- [ ] `no-new-date` en `error` en api; grep en 0
- [ ] code-reviewer con foco en zonas horarias

### Cierre
- [ ] `docs/MONOREPO-REPORT.md`
- [ ] Condición de cumplido 1–11 demostrada

## §Baseline

Corrido el 2026-10-19 con Node 24.19.0 en clones de los repos originales (scratchpad, no sobre `scout/*`).

| Repo | Corte | Commits `main` | Resultado |
|---|---|---|---|
| backend | `c77ee54` | 175 | `npm ci` ✓ · `build` ✓ (`dist/src/main.js`) · `jest --listTests` = **34** · `jest`: **34 suites / 593 tests**, 0 fallas · `eslint` (sin fix): **556 problemas (462 errores, 94 warnings)** |
| frontend | `11c7651` | 110 | `install --frozen-lockfile` ✓ · `typecheck` ✓ · `lint` **✗ 1 error** (`segmented-tabs.tsx:75` max-lines-per-function 54>50) · `test`: **108 archivos / 1033 tests**, 0 fallas · `build` ✓ |

Detalle de lint del backend: 426 errores en specs, 36 en `src` (cajas.service 24, filter-movimientos.dto 6, eventos.controller 2, 2 migraciones, sql-data-export 1, get-inscripciones-query.dto 1).
Por regla: unbound-method 231 · no-unsafe-member-access 119 · no-unsafe-argument (warn) 93 · no-unsafe-assignment 44 · require-await 20 · no-unsafe-return 18 · no-unsafe-call 15 · prettier 8 · no-unused-vars 6 · no-floating-promises (warn) 1 · no-base-to-string 1.

Hallazgo: `backend/package-lock.json` está en `.gitignore`. El repo del back no fija versiones y cada deploy resuelve los rangos de nuevo. El baseline usó el lockfile local del usuario.

## §Inventario

20 enums del back, **todos con valores idénticos** en el front. No hay hallazgos de valor. Las diferencias son solo de nombre.

| Back (`src/common/enums/index.ts` salvo nota) | Front (`src/shared/domain/…`) | Diferencia |
|---|---|---|
| PersonaType | persona/enums.ts `PERSONA_TYPE` | nombre (key `EXTERNA` = `'externo'` en ambos) |
| EstadoPersona | persona `ESTADO_PERSONA` | nombre |
| Rama | persona `RAMA` (+ `RAMAS`) | nombre |
| CargoEducador | persona `CARGO_EDUCADOR` (+ `CARGOS_EDUCADOR`) | nombre |
| CajaType | caja `CAJA_TYPE` (+ `FONDO_RAMA_TYPES`, `RAMA_TO_CAJA_TYPE`) | nombre |
| TipoMovimiento | movimiento `TIPO_MOVIMIENTO` | nombre |
| ConceptoMovimiento (19) | movimiento `CONCEPTO_MOVIMIENTO` | nombre |
| MedioPago | movimiento `MEDIO_PAGO` (+ `MEDIOS_PAGO`) | nombre |
| EstadoPago | movimiento `ESTADO_PAGO` | nombre |
| CategoriaMovimiento | movimiento `CATEGORIA_MOVIMIENTO` | nombre |
| EstadoInscripcion | inscripcion `ESTADO_INSCRIPCION` | nombre |
| TipoInscripcion | inscripcion `TIPO_INSCRIPCION` | nombre |
| EstadoPagoCampamento | campamento `ESTADO_PAGO_CAMPAMENTO` | nombre |
| TipoEvento | evento `TIPO_EVENTO` | nombre |
| DestinoGanancia | evento `DESTINO_GANANCIA` | nombre |
| ModalidadVenta | evento `MODALIDAD_VENTA` | nombre |
| EstadoCobroVenta | evento `ESTADO_COBRO_VENTA` | nombre |
| TipoDeuda | inscripcion `TIPO_DEUDA` | nombre; el front no tiene labels |
| FiltroMovimientosCampamento | movimiento `FILTRO_MOVIMIENTOS` | **nombre distinto** (sin "Campamento") |
| TipoDeudaFilter (`modules/reportes/constants/deuda.constants.ts`) | `features/reportes/models/deudas.ts` `TIPO_DEUDA_FILTER` | vive en una feature del front |

Constantes no-enum duplicadas: `VENTA_DERIVED_CONCEPTOS` (idéntica), `REPORTE_VARIANTE` / `REPORTE_SEVERIDAD` (back `eventos/reporte/reporte.constants.ts`, front `shared/domain/reporte/schemas.ts`, idénticas), `RAMA_EDUCADORES` / `DEUDA_RAMA_FILTERS` (back `deuda.constants.ts`, front `features/reportes/models/deudas.ts`).
Zona horaria: `APP_TIMEZONE` (back) = `BSAS_TIME_ZONE` (front) = `'America/Argentina/Buenos_Aires'`.

## §Fechas

_(Fase 8)_

## §Cambios de comportamiento

_(Solo Fase 8.)_

## §Bloqueos

_(ninguno por ahora)_

## §Deuda

- Tres spellings del filtro de educadores en el wire: `'Educadores'` (`RAMA_EDUCADORES`), `'educadores'` (literal en `cajas.service.ts:63`, `CAJAS_RAMA_EDUCADORES` en web), `'educador'` (`PersonaType.EDUCADOR`). No se unifican porque cambiaría el contrato.
- Web: `TIPO_DEUDA_LABELS` (features/reportes/constants/copy.ts) cubre los valores de `TipoDeudaFilter`, pero el nombre colisiona con el `TIPO_DEUDA` del dominio.
- api: `CLAUDE.MD` decía que no había auth (falso: `APP_GUARD` JWT).
- api: `railway.json` / `railpack.json` son restos sin uso (el deploy es Render).
- api: `package-lock.json` estaba ignorado (versiones no reproducibles).

## §Pendientes del usuario

Consolidado solo lo commiteado en `main` de cada repo. Quedó afuera, sin tocar:
- **backend** (`c77ee54`): ramas `chore/dead-code-cleanup`, `feat/bonificaciones-fondo-solidario`, `feat/eventos-modalidad-transicion`, `feat/eventos-venta-mixta`, `feat/inscripciones-persona-nueva`, `fix/deudas-nav-ventas` (worktree en `Desktop/scout-deudas-nav/backend`).
- **frontend** (`11c7651`): ramas `feat/edicion-inline` (worktree `.claude/worktrees/edicion-inline`), `feat/rediseno-insignia`, `fix/deudas-nav-ventas` (worktree `Desktop/scout-deudas-nav/frontend`), 8 ramas `worktree-agent-*`; worktree detached en `~/.claude/jobs/84517796/tmp/ei-test`.
- Sin cambios sin commitear en `main` en ninguno de los dos al momento del corte.

## §Bitácora

| Fecha | Fase | Hash | Nota |
|---|---|---|---|
| 2026-10-19 | 0 | (este commit) | Baseline, inventario y snapshot de wire |
