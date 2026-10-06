# REGISTRY-detail — testing

## `createFakeFetch` — `shared/api/testing/fake-fetch.ts`

`fetch` falso: `fake.reply({ status, body } | { networkError: true } | { blobText })` encola
respuestas; `fake.requests` registra url/método/headers/body. Se inyecta en `createApiClient` o con
`vi.stubGlobal('fetch', fake.fetchFn)`.

## Fixtures de dominio — `shared/domain/testing/fixtures.ts`

JSON con la forma exacta del backend (`MOVIMIENTO_FIXTURE`, `PROTAGONISTA_FIXTURE`, …) + `omitKeys`.
