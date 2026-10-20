# REGISTRY-detail — testing

## web (`apps/web/src/shared`)

### `createFakeFetch` — `shared/api/testing/fake-fetch.ts`

`fetch` falso: `fake.reply({ status, body } | { networkError: true } | { blobText })` encola
respuestas; `fake.requests` registra url/método/headers/body. Se inyecta en `createApiClient` o con
`vi.stubGlobal('fetch', fake.fetchFn)`.

### `makeJwt` · `tokenExpiringIn` — `shared/auth/testing/jwt.ts`

JWT de prueba con la forma que valida `decodeJwt` (`{sub,email,tipo,iat,exp}`).

### Fixtures de dominio — `shared/domain/testing/fixtures.ts`

JSON con la forma exacta del api (`MOVIMIENTO_FIXTURE`, `PROTAGONISTA_FIXTURE`, …) + `omitKeys`.

## shared (`packages/shared`)

`test/fixtures/wire-values.snapshot.json` — valores de wire tomados del backend original; los
compara `test/wire-contract.test.ts` contra `@scout/shared/enums`. Si agregás un valor de enum,
actualizá el snapshot en el mismo commit.

## api (`apps/api`)

**No hay utilidades de test compartidas, a propósito.** Los e2e (`test/*.e2e-spec.ts`) limpian
sus datos con funciones **inline en el propio spec**, filtradas por prefijo (regla 4 de
`apps/api/test/README.md`). No crear `helpers/database-cleaner.ts` ni similares.
