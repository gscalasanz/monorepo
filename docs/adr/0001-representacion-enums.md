# ADR 0001 — Representación canónica del vocabulario de dominio en `@scout/shared`

- **Estado:** aceptado (2026-10-19)
- **Contexto de la decisión:** consolidación en monorepo (MONOREPO.md, Fase 4)

## Contexto

El vocabulario que cruza el cable (tipos de persona, ramas, tipos de caja, conceptos de
movimiento…) estaba definido dos veces:

- **api:** `enum` de TypeScript en `src/common/enums/index.ts` (`PersonaType`, `CajaType`…).
- **web:** objetos `as const` en `src/shared/domain/<dominio>/enums.ts` (`PERSONA_TYPE`,
  `CAJA_TYPE`…) más `*_LABELS`.

El inventario (MONOREPO.md §Inventario) mostró que los 20 enums tienen **las mismas claves,
los mismos valores y el mismo orden** en los dos lados: la diferencia es solo de nombre del
identificador.

Restricciones: cero cambio de contrato (valores de wire, esquema de DB, OpenAPI) y no tocar los
cientos de imports existentes en cada app.

## Decisión

1. **Representación:** objeto `as const` + tipo homónimo.

   ```ts
   export const Rama = { MANADA: 'Manada', UNIDAD: 'Unidad', … } as const;
   export type Rama = (typeof Rama)[keyof typeof Rama];
   ```

2. **Nombre canónico:** el del api (PascalCase: `Rama`, `CajaType`, `ConceptoMovimiento`…). Es
   el que usan los decoradores de Nest y TypeORM, y el nombre del tipo ya era PascalCase en web.
   Excepción: las constantes que ya eran `SCREAMING_CASE` en ambos lados
   (`VENTA_DERIVED_CONCEPTOS`, `REPORTE_VARIANTE`, `REPORTE_SEVERIDAD`, `RAMA_EDUCADORES`,
   `DEUDA_RAMA_FILTERS`) conservan su nombre.

3. **Adaptadores:** cada app conserva su punto de import histórico y solo re-exporta:
   - api: `src/common/enums/index.ts` → `export { Rama, … } from '@scout/shared/enums'`.
   - web: `src/shared/domain/<d>/enums.ts` → `import { Rama as RAMA, type Rama } …` y
     re-export con el nombre del front. `FILTRO_MOVIMIENTOS` es alias de
     `FiltroMovimientosCampamento`.

4. **Qué NO sube a shared:** los `*_LABELS` (copy de UI en español) y los schemas zod (solo los
   usa web). Regla de promoción: solo sube lo que usan las dos apps hoy.

## Paridad verificada (spike con el dominio persona)

- **Runtime:** un `enum` de string de TS compila a exactamente el mismo objeto que el `as const`
  (`{ MANADA: 'Manada', … }`). `@IsEnum`, `@ApiProperty({ enum })` y `@Column({ type: 'enum',
  enum })` leen el objeto con `Object.values`/`Object.keys`, por lo que producen el mismo
  resultado. `emitDecoratorMetadata` emite `String` tanto para un enum de string como para una
  unión de literales.
- **OpenAPI:** el documento `/api/docs-json` (79 paths, 114 schemas) es byte a byte idéntico antes
  y después de migrar.
- **Esquema:** `migration:generate` contra el Neon de dev produce exactamente el mismo SQL que el
  backend original (drift preexistente, ver MONOREPO.md §Bloqueos), sin ningún statement
  atribuible a enums.
- **Contrato:** `packages/shared/test/wire-contract.test.ts` compara cada enum con
  `wire-values.snapshot.json`, tomado del backend original.

## Consecuencias

- (+) Una sola definición: agregar un valor se hace en un lugar y lo ven las dos apps y el
  test de contrato.
- (+) Cero cambios en los usos (cientos de imports en api y web).
- (−) **Se pierde la nominalidad** del `enum` de TS: el literal `'grupo'` ahora es asignable a
  `CajaType` sin pasar por `CajaType.GRUPO`. El chequeo de tipos es un poco más laxo; el runtime
  no cambia. Se acepta: es el mismo modelo que ya usaba web, y la validación de entrada sigue en
  `class-validator` (api) y zod (web).
- (−) Un tipo como `CajaType.GRUPO` ya no existe en posición de tipo; se escribe
  `typeof CajaType.GRUPO`. Hoy el api no lo usaba así (inventario).
