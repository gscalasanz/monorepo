# CLAUDE.md — `apps/api` (Scout, NestJS)

Detalle **del api**. Lo transversal (producto, stack, reglas de código, fechas, invariantes de
dominio, seguridad de datos, DoD, commits) vive en el hub: [`../../CLAUDE.md`](../../CLAUDE.md).
Estructura completa y flujo de request: [`docs/estructura-backend.md`](../../docs/estructura-backend.md).

## 1. Stack propio del api

- **NestJS 11**, TypeScript, **TypeORM 0.3** sobre PostgreSQL (Neon en dev/prod; Docker para test).
- **class-validator** + class-transformer en los DTOs (no zod).
- **Auth:** JWT propio con `@nestjs/passport` + `passport-jwt` (access + refresh; refresh tokens
  persistidos en `refresh_tokens`). Guard global y `@Public()` (ver §4).
- **Swagger** en `/api/docs` (JSON en `/api/docs-json`). Prefijo de rutas: `/api/v1`.
- **Jest** (unit `src/**/*.spec.ts`, e2e `test/*.e2e-spec.ts`).
- `exceljs` (exports), `bcrypt` (passwords).

## 2. Comandos

Desde la raíz: `pnpm --filter @scout/api <script>`; dentro de `apps/api`: `pnpm <script>`.

| Script | Qué hace |
| --- | --- |
| `dev` / `start:dev` | `nest start --watch` en `:3001` (`PORT`) |
| `start:debug` | Watch con debugger |
| `build` → `start:prod` | Compila a `dist/` y corre `node dist/src/main.js` |
| `lint` · `lint:fix` · `format` · `typecheck` | Calidad (`typecheck` cubre `tsconfig.build.json`) |
| `test` · `test:watch` · `test:cov` · `test:debug` | Unit tests (Jest, `rootDir: src`) |
| `test:e2e` · `test:e2e:watch` | ⚠️ e2e: levantan `AppModule` → **base de `.env.local` + migraciones** (ver §5) |
| `benchmark` | ⚠️ Igual que e2e (excluido de `test` a propósito) |
| `db:test:start` · `db:test:stop` · `db:test:logs` · `db:test:reset` | Postgres 15 de test en Docker (`docker-compose.test.yml`, puerto 5433) |
| `migration:generate` · `migration:create` · `migration:run` · `migration:revert` | CLI de TypeORM sobre `src/database/data-source.ts` |
| `seed` | `src/database/seeds/run-seeds.ts` |

No hay `docker-compose.yml` de desarrollo: la base de dev es la que apunta `DATABASE_URL` en
`.env.local` (no se lee ni se commitea).

## 3. Estructura (resumen)

```
src/
  main.ts            bootstrap: CORS, ValidationPipe, prefijo api/v1, Swagger
  app.module.ts      ConfigModule(.env.local) + módulos + APP_GUARD JwtAuthGuard
  common/            BaseEntity, enums (re-export de @scout/shared/enums), constants,
                     dtos de paginación, DeletionValidatorService, utils
  database/          database.module.ts, data-source.ts (CLI), migrations/, seeds/
  modules/<dominio>/ <dominio>.module|controller|service.ts + dtos/ entities/ (+ services/,
                     constants/, helpers/ si hace falta)
test/                *.e2e-spec.ts + jest-e2e.json + README.md (reglas de datos)
```

Módulos: `auth`, `personas`, `cajas`, `movimientos`, `pagos`, `bonificaciones`,
`inscripciones`, `campamentos`, `eventos` (incl. `reporte/`), `reportes`, `exports`, `backups`
(+ `benchmark`, solo spec).

## 4. Patrones

- **Enums:** `src/common/enums` **re-exporta** `@scout/shared/enums` (ADR 0001). Un valor nuevo
  se agrega en `packages/shared/src/enums/<dominio>.ts`, nunca acá. En posición de tipo:
  `typeof CajaType.GRUPO`.
- **Fechas:** `@scout/shared/time` (`APP_TIMEZONE` en `common/constants` es alias de
  `BSAS_TIME_ZONE`). Columnas `date` con `dateOnlyTransformer`. `no-new-date` en `error`:
  "ahora" es `nowDate()`/`nowInstant()`, parseo `dateFromIsoString`, año de negocio
  `businessYearOf`/`currentYearBsAs`. Jest corre con `TZ=UTC` (como Render).
- **DTOs:** class-validator en `modules/<m>/dtos/`; el `ValidationPipe` global hace
  `whitelist` + `forbidNonWhitelisted` + `transform` (conversión implícita activada).
- **Services:** lógica de negocio + repositorios TypeORM / query builders. Filtros `ILIKE` con
  `escapeLikePattern`.
- **Entidades:** extienden `BaseEntity` (UUID, `createdAt`, `updatedAt`, `deletedAt`). Borrado
  = `softDelete()`, previo chequeo con `DeletionValidatorService`.
- **Auth:** todo endpoint es privado por defecto (`APP_GUARD` → `JwtAuthGuard` en
  `app.module.ts`). Para abrirlo: `@Public()` (`modules/auth/decorators`). Usuario actual:
  `@CurrentUser()`. El refresh token se valida en `AuthService.refresh` (hash guardado en
  `refresh_tokens`); `JwtRefreshGuard` existe pero no está en uso.
- **CORS:** `resolveAllowedOrigins` (`common/utils/cors-origins.util.ts`): siempre
  `http://localhost:4201` + la lista separada por comas de `FRONTEND_URL`.
- **Contrato:** respuestas crudas (sin envelope); solo `GET /movimientos` pagina
  (`PaginatedResponseDto`). No cambiar el contrato sin acordarlo (lo consume `apps/web`).

## 5. Base de datos y tests (leer antes de tocar `test/` o `database/`)

- `AppModule` carga `.env.local` y `DatabaseModule` corre con **`migrationsRun: true`** y
  `synchronize: false`: levantar la app (dev, e2e, benchmark) **aplica migraciones pendientes**
  a esa base.
- Reglas de datos de los e2e (no negociables): [`test/README.md`](./test/README.md) — nada de
  `DELETE` sin `WHERE`/`TRUNCATE`/`dropSchema`; todo dato de test con prefijo propio y limpiado
  en el mismo spec, respetando el orden de FKs; nada de helpers genéricos de cleanup.
- Migraciones: `migration:generate` hoy detecta un **drift preexistente** (MONOREPO.md
  §Bloqueos), no sirve como detector limpio. Revisar a mano el SQL generado. Nunca correr
  `migration:run`/`revert` contra producción desde una máquina local.

## 6. Commits

Tipos del monorepo (hub §7): `feat|fix|refactor|docs|test|chore|perf|ci`. Scopes habituales:
`api`, `personas`, `cajas`, `movimientos`, `inscripciones`, `campamentos`, `eventos`,
`reportes`, `auth`, `database`, `common`.

## 7. Archivos clave

| Archivo | Para qué |
| --- | --- |
| `src/main.ts` | Bootstrap (CORS, pipes, prefijo, Swagger) |
| `src/app.module.ts` | Módulos + guard JWT global |
| `src/common/entities/base.entity.ts` | UUID, timestamps, soft delete |
| `src/common/enums/index.ts` | Adaptador de `@scout/shared/enums` |
| `src/common/services/deletion-validator.service.ts` | ¿Se puede borrar? (movimientos = libro contable) |
| `src/database/database.module.ts` | TypeORM runtime (`migrationsRun: true`) |
| `src/database/data-source.ts` | DataSource del CLI de migraciones |
| `test/README.md` | Reglas de seguridad de datos de los e2e |
| `docs/` | Guías históricas del backend (API_REFERENCE, guías para el front, planes) |
