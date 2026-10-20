# Estructura del Backend — Scout (`apps/api`)

> Cómo se organiza el api NestJS. Complementa [`principios-ingenieria.md`](./principios-ingenieria.md)
> y el detalle operativo de [`../apps/api/CLAUDE.MD`](../apps/api/CLAUDE.MD). El frontend está
> en [`estructura-frontend.md`](./estructura-frontend.md).

---

## Principio: un módulo Nest por dominio

Cada dominio de negocio es un módulo con su controller, service, DTOs y entidades. Lo que usan
2+ módulos sube a `src/common/`; lo que usan web y api a la vez, a `@scout/shared`.

```
apps/api/
  src/
    main.ts                 bootstrap (ver "Flujo de un request")
    app.module.ts           ConfigModule(.env.local) + módulos + APP_GUARD JwtAuthGuard
    app.controller.ts       GET / (público, keep-alive)
    common/                 lo reutilizable entre módulos (CommonModule es @Global)
      entities/             BaseEntity
      enums/                adaptador: re-export de @scout/shared/enums
      constants/            app.constants (APP_TIMEZONE = BSAS_TIME_ZONE, …)
      dtos/                 PaginationQueryDto, PaginatedResponseDto
      services/             DeletionValidatorService (+ mensajes)
      utils/                cors-origins, date-only.transformer, papeles, sql-like
    database/
      database.module.ts    TypeORM runtime (migrationsRun: true, synchronize: false)
      data-source.ts        DataSource del CLI de migraciones
      migrations/           migraciones TypeORM (timestamp-Nombre.ts)
      seeds/                run-seeds.ts + seeds
      __tests__/            specs de migraciones
    modules/
      auth/                 login/refresh/logout/me/password/email, JWT, guards, decorators
      personas/ cajas/ movimientos/ pagos/ bonificaciones/
      inscripciones/ campamentos/ eventos/ (incl. reporte/) reportes/
      exports/ backups/     xlsx y backup descargable
      benchmark/            solo un spec (excluido de `test`)
  test/                     e2e (*.e2e-spec.ts) + jest-e2e.json + README.md
  dist/src/main.js          salida de build (`start:prod`)
```

### Forma de un módulo

```
modules/<dominio>/
  <dominio>.module.ts       TypeOrmModule.forFeature([...]) + providers
  <dominio>.controller.ts   rutas, Swagger (@ApiTags/@ApiOperation), DTOs de entrada
  <dominio>.service.ts      lógica de negocio + repositorios / query builders
  <dominio>.service.spec.ts unit tests al lado del código
  dtos/                     class-validator (+ @ApiProperty)
  entities/                 entidades TypeORM (extienden BaseEntity)
  services/ constants/ helpers/ interfaces/ validators/   solo si hacen falta
```

---

## Flujo de un request

Configurado en `src/main.ts` y `src/app.module.ts`:

1. **CORS:** `resolveAllowedOrigins(process.env.FRONTEND_URL)` → siempre `http://localhost:4201`
   + los orígenes de `FRONTEND_URL` (separados por coma); `credentials: true`; headers
   `Content-Type` y `Authorization`.
2. **Prefijo global:** `api/v1` (todas las rutas viven bajo `/api/v1`).
3. **Guard global:** `APP_GUARD` → `JwtAuthGuard`. Todo endpoint exige `Authorization: Bearer
   <access>` salvo los marcados con `@Public()` (`modules/auth/decorators/public.decorator.ts`).
4. **Validación:** `ValidationPipe` global con `whitelist`, `forbidNonWhitelisted`, `transform`
   y `enableImplicitConversion` → un campo de más es `400`.
5. **Controller → service → repositorio TypeORM.** Respuesta JSON cruda (sin envelope).
6. **Errores:** excepciones HTTP de Nest (`NotFoundException`, `BadRequestException`…) con
   `message` en español.

**Swagger:** `/api/docs` (UI) y `/api/docs-json` (OpenAPI), con bearer auth. Puerto `PORT`
(default `3001`).

---

## Persistencia

- **`BaseEntity`** (`common/entities/base.entity.ts`): `id` UUID, `createdAt`/`updatedAt`
  `timestamptz`, `deletedAt` (soft delete). Toda entidad la extiende.
- **Soft delete:** `repository.softDelete()`; antes, `DeletionValidatorService` decide si se
  puede (no se borra lo que tiene movimientos).
- **Personas:** Single Table Inheritance (`@TableInheritance` sobre `personas.tipo`;
  `@ChildEntity` por `PersonaType`: protagonista, educador, externo, agrupación).
- **Enums:** las columnas `enum` y los `@IsEnum`/`@ApiProperty({ enum })` usan los objetos de
  `@scout/shared/enums` vía `src/common/enums` (ADR 0001: mismo runtime, mismo OpenAPI).
- **Fechas:** columnas `date` con `dateOnlyTransformer`; lógica de "hoy"/zonas con
  `@scout/shared/time` (`no-new-date` en `warn` hasta MONOREPO.md Fase 8).
- **Saldos:** `saldoActual` nunca se persiste; se calcula desde movimientos.

### Migraciones

- Viven en `src/database/migrations/` y las corre el CLI de TypeORM sobre
  `src/database/data-source.ts` (lee `.env.local` y luego `.env`):
  `pnpm --filter @scout/api migration:generate|create|run|revert`.
- **Además, `AppModule` corre `migrationsRun: true`:** levantar el api (dev, e2e, benchmark)
  aplica las pendientes a la base configurada.
- `migration:generate` hoy produce un drift preexistente (MONOREPO.md §Bloqueos): revisar a
  mano el SQL y no commitear ese ruido.
- **Nunca** correr migraciones contra producción desde una máquina local.

---

## Tests

| Tipo | Ubicación | Comando | Base |
| --- | --- | --- | --- |
| Unit | `src/**/*.spec.ts` (al lado del código) | `pnpm --filter @scout/api test` | ninguna (mocks de repositorio) |
| E2E | `test/*.e2e-spec.ts` (`test/jest-e2e.json`) | `pnpm --filter @scout/api test:e2e` | ⚠️ la de `.env.local` |
| Benchmark | `src/modules/benchmark/` | `pnpm --filter @scout/api benchmark` | ⚠️ la de `.env.local` |

Los e2e importan `AppModule`, que lee `.env.local` (no la base de Docker de
`docker-compose.test.yml`) y aplica migraciones. Por eso, reglas de
[`apps/api/test/README.md`](../apps/api/test/README.md), no negociables:

1. Nada de `DELETE` sin `WHERE`, `TRUNCATE` ni `dropSchema`.
2. Todo dato de test lleva un **prefijo único por suite** y el cleanup filtra por ese prefijo.
3. El cleanup respeta el orden de FKs (hijos primero).
4. El cleanup vive **inline en el spec**; no hay helpers genéricos de limpieza.

---

## Build y ejecución

- `pnpm --filter @scout/api build` (`nest build`) → `dist/`; `start:prod` = `node dist/src/main.js`.
- `typecheck` usa `tsconfig.build.json` (los specs tienen errores de tipos preexistentes,
  MONOREPO.md §Deuda).
- tsconfig base: `@scout/config/tsconfig/nestjs.json` (`module: nodenext`, necesario para los
  subpaths `exports` de `@scout/shared`).
- ESLint: `apps/api/eslint.config.mjs` (`apiPreset` de fronteras + `no-new-date` en `warn`).
