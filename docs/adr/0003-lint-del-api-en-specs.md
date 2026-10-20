# ADR 0003 — Alcance de las reglas type-aware del lint del api en specs

- **Estado:** aceptado
- **Fecha:** 2026-10-20
- **Contexto:** MONOREPO.md Fase 6 ("Lint del api en verde: fix o ADR")

## Contexto

El lint del api (`recommendedTypeChecked` de typescript-eslint) nunca estuvo en verde en
`scout-back`. El baseline daba 462 errores, con 426 en specs. Los repartía así:
`unbound-method` 231, `no-unsafe-member-access` 119, `no-unsafe-assignment` 44,
`no-unsafe-return` 18, `no-unsafe-call` 15 y `no-unsafe-argument` (warn) 93. Casi todos son el
mismo patrón de Jest:

- `expect(repository.save).toHaveBeenCalledWith(…)`: `unbound-method`. El método nunca se
  invoca suelto: Jest solo inspecciona el mock.
- `jest.fn()` / `mock.calls[0][0]` / `createQueryBuilder` mockeado tipan `any`: `no-unsafe-*`.

Dejar el gate de lint en rojo lo vuelve inútil (CI y lint-staged lo exigen). Tipar a mano
~430 usos de mocks es un cambio grande en tests, sin valor de producto y con riesgo de
alterar lo que verifican.

## Decisión

En `**/*.spec.ts` y `**/*.e2e-spec.ts` (y solo ahí) se apagan `unbound-method` y
`no-unsafe-{argument,assignment,call,member-access,return}`. En `src` no-spec quedan como
estaban y los errores existentes se corrigieron, sin cambio de comportamiento. El resto de las
reglas (`require-await`, `no-unused-vars`, prettier, `no-unnecessary-type-assertion`…) sigue
activo también en specs y se corrigió.

## Consecuencias

- `pnpm --filter @scout/api lint` en 0 errores, y el gate (CI + lint-staged) pasa a ser real.
- Los specs pueden usar mocks sin tipar. El código de producción no.
- Si se agrega `eslint-plugin-jest`, su `jest/unbound-method` (consciente de `expect`) puede
  reemplazar el apagado de `unbound-method`.
