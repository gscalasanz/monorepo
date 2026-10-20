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
- [x] `apps/api` importado con historial (filter-repo, clon fresco)
- [x] `apps/web` importado con historial (filter-repo, clon fresco)
- [x] Verificación: conteo de commits, `log --follow`, `blame` — `rev-list --count` de cada padre importado: api **175**, web **110** (= originales). `git log -- apps/api` muestra 168 por simplificación de historial (merges TREESAME); con `--full-history` da 177 (175 + 2 merges de importación). `log --follow apps/api/src/main.ts` llega a `0b52d45 first commit`; `blame` conserva autor y fecha originales.

### Fase 2 — Workspace pnpm + Turborepo
- [x] Raíz: `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `.nvmrc` 24.19
- [x] Paquetes renombrados `@scout/api`, `@scout/web`
- [x] `apps/api` de npm a pnpm (versiones efectivas anotadas en §Baseline, sin `shamefully-hoist`; ninguna dependencia fantasma)
- [x] Scripts uniformes (`dev`, `build`, `lint`, `lint:fix`, `typecheck`, `test`, `test:e2e`)
- [x] api buildea y testea con Node 24 — `turbo run build typecheck test --filter=@scout/api`: 34 suites / 593 tests ✓, `dist/src/main.js` ✓
- [x] `pnpm dev` levanta web:4201 y api:3001 — verificado en puertos alternativos (3101/4301) porque 3001/4201 los ocupaban los dev servers del usuario (`scout/backend`, `scout/frontend`): `GET /api/v1` = `Hello World!` (igual al original), `/personas` sin token 401 en ambos, preflight CORS idéntico, `/login` 200
- [x] code-reviewer de la fase (hallazgos HIGH corregidos en `5f18908`)

### Fase 3 — `packages/config`
- [x] tsconfig `base`/`nextjs`/`nestjs` (nextjs con `jsx: react-jsx` de Next 16; nestjs con `nodenext` como el api, necesario para los subpaths `exports` de `@scout/shared`)
- [x] eslint `base`, `no-new-date` (presets web/api/packages), `feature-boundaries`, `monorepo-boundaries` con tests — `node --test`: 22/22
- [x] `apps/web` consume presets sin cambio de reglas — `tsc --showConfig` idéntico; `eslint --print-config` en 5 archivos: única diferencia = `no-restricted-imports` (frontera nueva web ↛ api)
- [x] `apps/api` adopta `monorepo-boundaries` + `no-new-date` (warn) + tsconfig `nestjs` con `dist/src/main.js` intacto — `dist/` byte a byte idéntico (`diff -rq`, sin contar tsbuildinfo); `--print-config`: solo se suman `no-restricted-imports` y `no-restricted-syntax` (warn en src, off en specs/e2e/migraciones); 30 warnings de no-new-date

### Fase 4 — `packages/shared`
- [x] Paquete CJS con `exports` `.`, `./enums`, `./time` (`./enums` y `./time` sin zod)
- [x] Test de contrato contra el snapshot (primero, en rojo: 25/25 fallando → 25/25 verde al cerrar reporte)
- [x] Spike de paridad Nest (`@IsEnum`, Swagger, TypeORM) + ADR de representación — `docs/adr/0001-representacion-enums.md`; OpenAPI (`/api/docs-json`, 79 paths/114 schemas) byte a byte idéntico tras cada dominio
- [x] Dominios: persona · caja · movimiento · inscripción · campamento · evento · reporte (un commit por dominio; inscripción/campamento/evento verificados con typecheck api+specs+web y contrato, y suite completa + OpenAPI al cerrar reporte: api 593 ✓, web 1033 ✓)
- [x] `migration:generate` sin archivo — **adaptado** (ver §Bloqueos): genera el mismo SQL que el backend original (drift preexistente); el archivo se movió fuera del repo, nunca se ejecutó
- [x] `time` movido; `APP_TIMEZONE` única — `git mv` (renames); web re-exporta `@/shared/time` con la misma API; `grep` del literal de zona: 1 definición (`packages/shared/src/time/constants.ts`)
- [x] code-reviewer de la fase (hallazgos corregidos en `fdf2ed7`)

### Fase 5 — Gobierno
- [x] `CLAUDE.md` hub + `apps/*/CLAUDE.md` como detalle
- [x] `REGISTRY.md` + `REGISTRY-detail/{domain,api,ui,testing}.md`
- [x] `docs/` (principios, flujo-confiable, estructura-frontend, estructura-backend, producto)
- [x] `scripts/setup-worktree.sh`
- [x] `.claude/settings.json` + hooks; skills evaluadas

### Fase 6 — Gates de calidad
- [ ] husky + lint-staged + commitlint
- [ ] `.github/workflows/ci.yml` (quality + security) + `dependabot.yml`
- [ ] Lint del api en verde (fix o ADR)
- [ ] code-reviewer de la fase

### Fase 7 — Deploy (preparado, no ejecutado)
- [ ] `docs/deploy.md` (Vercel, Render, checklist post-cutover, plan de remotos)

### Fase 8 — Fechas en el api
- [x] Inventario §Fechas
- [x] `@scout/shared/time` completado con TDD
- [x] Clase A migrada
- [x] Clase C migrada
- [x] Clase B corregida (test rojo → verde)
- [x] `no-new-date` en `error` en api; grep en 0
- [x] code-reviewer con foco en zonas horarias (aprobado, sin CRITICAL/HIGH; MEDIUM-2 documentado y fijado con test, MEDIUM-1 → §Deuda)

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

Versiones efectivas del api al pasar a pnpm (rangos intactos; resolución nueva dentro del rango, igual a lo que hacía Render sin lockfile): 26 de 47 dependencias directas subieron de minor/patch respecto del lock local del usuario — `@nestjs/common|core|platform-express|testing` 11.1.x→11.2.7, `@nestjs/swagger` 11.2.7→11.4.7, `@nestjs/typeorm` 11.0.0→11.0.3, `typeorm` 0.3.28→0.3.31, `pg` 8.18.0→8.23.1, `class-validator` 0.14.3→0.14.4, `dotenv` 17.4.1→17.4.2, `jest` 30.2→30.5.2, `ts-jest` 29.4.6→29.4.15, `typescript-eslint`/`@typescript-eslint/*` 8.55→8.71.1, `eslint` 9.39.2→9.39.5, `prettier` 3.8.1→3.9.9, `supertest` 7.2.2→7.3.1, `@nestjs/cli` 11.0.19→11.0.24, `@nestjs/schematics` 11.0.10→11.1.0, `ts-loader` 9.5.4→9.6.2, `@types/node` 22.19.10→22.20.5, `@eslint/js` 9.39.2→9.39.5, `@eslint/eslintrc` 3.3.3→3.3.7, `eslint-plugin-prettier` 5.5.5→5.5.7, `globals` 16.5.0→16.4.0. Tests y build idénticos al baseline. Web: 0 cambios en dependencias directas (lockfile original reubicado con importer `apps/web`).

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

Re-inventario sobre `apps/api/src` (sin specs ni migraciones): **29 líneas / 28 sitios** con `new Date(`/`Date.now(` en 19 archivos. Clases: **A** = "ahora" sin semántica de calendario (reemplazo directo); **B** = año/fecha de negocio calculado en la zona del proceso (bug de TZ); **C** = parseo de un string (se conserva la semántica exacta de `new Date(string)`).

| Archivo:línea (original) | Uso | Clase | Resolución | Commit |
|---|---|---|---|---|
| `personas/services/personas-dashboard.service.ts:100` | `new Date().getFullYear()` | B | `currentYearBsAs()` | `c868d41` |
| `personas/services/personas-dashboard.service.ts:263` | año de `fechaInicio` | B | `businessYearOf(fechaInicio)` | `c868d41` |
| `reportes/reportes.service.ts:208` | filtro por año de `fechaInicio` | B | `businessYearOf` | `406080c` |
| `reportes/reportes.service.ts:355` | `ano` de `fechaInicio` | B | `businessYearOf` | `406080c` |
| `exports/services/exports.service.ts:45` | nombre de archivo con hora local del proceso | B | `formatInBsAs(instantOf(now), FILENAME_TIMESTAMP_PATTERN)` | `1135580` |
| `backups/services/backups.service.ts:14` | ídem | B | ídem | `c30cbe8` |
| `eventos/services/entregas-evento.service.ts:440` | `new Date(dto.fecha)` | C | `dateFromIsoString` | `4fb6d1b` |
| `campamentos/campamentos.controller.ts:365` | `new Date(fecha)` | C | `dateFromIsoString` | `f6a1ecd` |
| `campamentos/campamentos.service.ts:693` | sort por `new Date(x).getTime()` | C | `epochMsOf` | `f6a1ecd` |
| `database/seeds/movimientos-ajuste-inicial.seed.ts:228` | literal con offset `-03:00` | C | `dateFromIsoString` | `3ba95d6` |
| `auth/auth.service.ts:145,152,168,174,228,288` | expiración/revocación de refresh tokens | A | `nowMs()`, `nowDate()`, `dateFromMs()` | `75bb617` |
| `exports/services/workbook-builder.service.ts:35` | `workbook.created` | A | `nowDate()` | `5a7d917` |
| `eventos/reporte/strategies/reporte-grupo.strategy.ts:51`, `reporte-venta.builder.ts:76` | `generadoEn` | A | `nowInstant()` | `800c6cb` |
| `backups/services/sql-data-export.service.ts:32` | cabecera `-- Generated:` | A | `nowInstant()` | `be7d8fd` |
| `movimientos/movimientos.service.ts:517,671` | `dto.fecha ?? new Date()` | A | `nowDate()` | `b03f891` |
| `eventos/eventos.service.ts:740` | fecha de entrega inmediata | A | `nowDate()` | `be00a66` |
| `pagos/pagos.service.ts:76,116` | fecha de los movimientos del pago | A | `nowDate()` | `1bf213b` |
| `bonificaciones/bonificaciones.service.ts:96` | fecha de la transferencia | A | `nowDate()` | `ce8db1c` |
| `inscripciones/inscripciones.service.ts:926` | `fecha` del consolidado | A | `nowInstant()` | `c5716c8` |
| `cajas/cajas.service.ts:476` | `fecha` del consolidado de saldos | A | `nowInstant()` | `717b452` |

Cada sitio A/C tiene un test de caracterización con reloj fijo (`jest.setSystemTime('2026-12-31T23:30:00-03:00')`) que pasó **antes y después** del reemplazo sin tocarlo. Funciones nuevas en `@scout/shared/time` (`date-interop.ts`, TDD, `dd41a36`): `nowDate`, `dateFromMs`, `dateFromIsoString`, `epochMsOf`, `instantOf`, `businessYearOf`. Jest del api corre con `TZ=UTC` (`jest.global-setup.js`, `b6bc65e`), igual que Render.

Verificación final: `grep -rnE "new Date\(|Date\.now\(" apps/api/src | grep -vE "\.spec\.ts|/migrations/"` → **0 líneas**; `no-new-date` en `error` (`a3e3477`) con 0 hits; api 37 suites / **622 tests** (baseline 593).

Matiz único: `dateFromMs` lanza con `NaN`, donde `new Date(NaN)` daba un `Invalid Date` silencioso (auth, si `getRefreshTokenExpirationMs()` devolviera `NaN`; hoy viene de config validada y antes el insert también fallaba, en Postgres).

## §Cambios de comportamiento

Los 6 sitios de clase B. Todos se manifiestan en Render (proceso en UTC) entre las 21:00 y las 23:59 de Argentina, y en particular el 31/12.

| Sitio | Test rojo (evidencia) | Efecto visible para el usuario |
|---|---|---|
| `personas-dashboard`: año actual (`c868d41`) | con TZ=UTC y reloj `2026-12-31T23:30-03:00`: `Expected [2026]`, `Received [2027]` | El 31/12 desde las 21:00 el dashboard de una persona tomaba el año siguiente como "año actual". |
| `personas-dashboard`: año del campamento (`c868d41`) | con TZ=AR, `fechaInicio` `2027-01-01T00:00Z`: `Expected 2027`, `Received 2026` | Un campamento que empieza el 1/1 se agrupaba en el año anterior si el proceso corría en hora AR (dev local). |
| `reportes`: filtro y `ano` por año del campamento (`406080c`) | con TZ=AR: `Expected [2027]`, `Received []` | Mismo caso en el reporte: el campamento del 1/1 desaparecía del filtro de su año. |
| `exports`: nombre del archivo (`1135580`) | TZ=UTC: `Expected scout-export-20261231-233000.xlsx`, `Received scout-export-20270101-023000.xlsx` | El nombre del Excel descargado ahora muestra la hora de Argentina (antes: UTC, +3 h). |
| `backups`: nombre del archivo (`c30cbe8`) | ídem con `scout-backup-…` | Ídem para el backup. |

Los tests previos de exports/backups codificaban la hora local del proceso. Se reescribieron con instantes de offset explícito (más el caso 31/12 23:30).

## §Bloqueos

- **Condición 7 (`migration:generate` sin archivo) no se puede cumplir tal como está escrita.** Evidencia: contra el Neon de dev, `migration:generate` del **backend original** (`c77ee54`, clon en scratchpad) ya genera una migración de 64 sentencias (FKs/índices/constraints de `entregas`, `entregas_lineas`, `ventas_productos` creados a mano en migraciones con nombres distintos a los que derivaría TypeORM, y recreación de 3 tipos enum con `enumName`). El monorepo genera **exactamente el mismo SQL** (`diff` vacío) antes y después de unificar los enums. Corregirlo exige una migración de esquema (cambio de comportamiento + escritura en DB, prohibido). Criterio adoptado: *SQL idéntico al del original*. Opciones para el usuario: (a) alinear las entidades con los nombres reales (`@Index({ name })`, `@ForeignKey`/`foreignKeyConstraintName`) — cambio solo de código, sin migración; (b) aceptar el drift.
- **Fechas calendario que viajan como instante (Fase 8, se conservó el comportamiento).** `POST /campamentos/:id/gastos` (`fecha`) y las entregas de eventos (`dto.fecha`): web manda `todayBsAs()` (`YYYY-MM-DD`), el api hace `new Date('YYYY-MM-DD')` → **medianoche UTC** (21:00 del día anterior en AR) y lo guarda en una columna timestamp; web lo compensa leyendo `T00:00:00.000Z` como fecha calendario. Swagger documenta `date-time`. Se reemplazó por `dateFromIsoString` (misma semántica, con test de caracterización). Opciones: (a) dejarlo así (consistente hoy entre web y api); (b) migrar a columnas `date` con `dateOnlyTransformer` — cambio de esquema y de contrato, requiere acordarlo.

## §Deuda

- Tres spellings del filtro de educadores en el wire: `'Educadores'` (`RAMA_EDUCADORES`), `'educadores'` (literal en `cajas.service.ts:63`, `CAJAS_RAMA_EDUCADORES` en web), `'educador'` (`PersonaType.EDUCADOR`). No se unifican porque cambiaría el contrato.
- Web: `TIPO_DEUDA_LABELS` (features/reportes/constants/copy.ts) cubre los valores de `TipoDeudaFilter`, pero el nombre colisiona con el `TIPO_DEUDA` del dominio.
- api: `CLAUDE.MD` decía que no había auth (falso: `APP_GUARD` JWT).
- api: `railway.json` / `railpack.json` son restos sin uso (el deploy es Render).
- api: `package-lock.json` estaba ignorado (versiones no reproducibles). Resuelto: `pnpm-lock.yaml` versionado.
- api: 51 errores de tipos preexistentes en 7 specs (`tsc -p tsconfig.json`; idéntico en el original). `nest build` y ts-jest no los ven. `typecheck` cubre por ahora la superficie de build (`tsconfig.build.json`); se resuelve en Fase 6.
- api: scripts con `ts-node` ahora pasan `-P tsconfig.json`. Con pnpm, `node_modules/typeorm/cli.js` es un symlink al store y ts-node (script mode) no encontraba el tsconfig del api; Node 24 cargaba `data-source.ts` como ESM (`__dirname is not defined`). Sin cambio funcional.
- api lint con las versiones nuevas: 465 errores (baseline 462): +4 `no-unnecessary-type-assertion` (regla nueva del recommended de typescript-eslint 8.71) y −1 `prettier` (prettier 3.9). Se resuelve en Fase 6.
- api: `password.service.spec.ts` (bcrypt 12 rounds real) pasaba el timeout de 5 s de jest bajo `turbo run test build` en paralelo. Se fijó `jest.setTimeout(30s)` en ese spec (solo test).
- api: el drift entidades↔esquema (§Bloqueos) existe desde antes; `migration:generate` no sirve como detector de cambios hasta corregirlo.
- api: `@nestjs/swagger` 11.4.7 agrega `"type":"object"` en 2 schemas `nullable`+`allOf` del OpenAPI (`PersonaDashboardDto`, `PersonaDeudaDto`) respecto del backend corriendo con 11.2.7. Solo documentación Swagger; payloads idénticos.
- Pérdida de nominalidad de los enums (ADR 0001): requirió `new Set<CajaType>(…)` explícito en `cajas.service.ts`.
- Entorno: el Escritorio parece sincronizado con iCloud (`fileproviderd`/`cloudd`/`fseventsd` saturan la CPU con `node_modules`, `.next`, `dist`); load average de 20–100 durante la sesión y timeouts espurios en tests. Recomendado: mover el repo fuera de `~/Desktop` o excluirlo de iCloud.
- web: `feature-boundaries` resuelve imports con el resolver `node`, así que los imports `@/features/...` (alias) no se chequean; solo los relativos. Igual que antes de la migración. Activar `eslint-import-resolver-typescript` destaparía violaciones existentes: queda como deuda.
- api: el peer `webpack@^5.112` de `schema-utils` (vía `@nestjs/cli`) queda sin satisfacer (5.106.2). Solo afecta al CLI en dev; existía igual con npm.
- api: `POST /campamentos/:id/gastos` toma `fecha` con `@Body('fecha')` sin validación; un valor inválido daba 500 (error de pg) y hoy da 500 (`dateFromIsoString` lanza). Lo correcto sería 400 (`@IsDateString`/pipe), pero es cambio de contrato. Review F8, MEDIUM-1.
- api: el test del dashboard de personas que usa el reloj real depende del año en curso. Los nuevos tests de caracterización sí fijan el reloj.

## §Pendientes del usuario

Consolidado solo lo commiteado en `main` de cada repo. Quedó afuera, sin tocar:
- **backend** (`c77ee54`): ramas `chore/dead-code-cleanup`, `feat/bonificaciones-fondo-solidario`, `feat/eventos-modalidad-transicion`, `feat/eventos-venta-mixta`, `feat/inscripciones-persona-nueva`, `fix/deudas-nav-ventas` (worktree en `Desktop/scout-deudas-nav/backend`).
- **frontend** (`11c7651`): ramas `feat/edicion-inline` (worktree `.claude/worktrees/edicion-inline`), `feat/rediseno-insignia`, `fix/deudas-nav-ventas` (worktree `Desktop/scout-deudas-nav/frontend`), 8 ramas `worktree-agent-*`; worktree detached en `~/.claude/jobs/84517796/tmp/ei-test`.
- Sin cambios sin commitear en `main` en ninguno de los dos al momento del corte.

## §Skills (triage de `scout/skills`, Fase 5)

| Skill | Decisión | Motivo |
|---|---|---|
| `typescript` | **Adoptada** → `.claude/skills/typescript` | Genérica y vigente para web y api |
| `nestjs`, `typeorm`, `jest` | No se copian | Su contenido útil quedó en `apps/api/CLAUDE.MD` y `docs/estructura-backend.md`; parte describe patrones que el api no usa |
| `casbin` | Descartada | El api no usa Casbin (auth = JWT + `@Public()`) |
| `changelog` | Descartada | No hay `CHANGELOG.md` en ningún repo |
| `commit` | Descartada | La reemplaza commitlint + hub §7 |
| `code-quality` | Descartada | Reemplazada por `docs/principios-ingenieria.md` (+ ESLint) |
| `docs`, `task-spec`, `workflow`, `codebase-analyzer` | Descartadas | Flujo `docs/todo.md` / ANALYZE-BLUEPRINT de la era backend; el hub §11 define el flujo actual |
| `skill-creator`, `skill-sync` | Descartadas | Meta-skills ligadas a un `AGENTS.md` que no existe en el monorepo |

## §Bitácora

| Fecha | Fase | Hash | Nota |
|---|---|---|---|
| 2026-10-19 | 0 | `0229a4f` | Baseline, inventario y snapshot de wire |
| 2026-10-19 | 1 | `4cbf312` | Historial importado con filter-repo desde clones frescos; cero cambios de código |
| 2026-10-20 | 4 | `73f3671` | `@scout/shared` (enums ×7 dominios + time). Contrato 25/25, OpenAPI idéntico, SQL de migration:generate idéntico al original. Nota: `campamento.ts`/`evento.ts` de shared entraron (sin exportar) en el commit de inscripción |
| 2026-10-20 | 2 | `891a819` | Workspace pnpm + turbo; review: env de runtime por turbo (`5f18908`) |
| 2026-10-20 | 3 | `d417be7` | `@scout/config`; configs efectivas (tsconfig/eslint) diffeadas antes/después, dist del api byte-idéntico |
| 2026-10-20 | 5 | `c8edb0e`…`3a0bd1d` | Hub, REGISTRY, docs, setup-worktree (probado en worktree real), `.claude` |
| 2026-10-20 | 8 | `dd41a36`…`a3e3477` | Fechas del api: 5 fixes B con test rojo, 10 módulos A, 4 C; `no-new-date` en error; 622 tests |
