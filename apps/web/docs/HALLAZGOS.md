# Hallazgos del backend y del Angular (leer antes de migrar cada módulo)

Relevados al construir `src/shared` (Fase 1). **No se arreglan acá**: el backend y el Angular
están fuera de alcance. Los schemas zod de `src/shared/domain` ya absorben las inconsistencias de
forma. Si un módulo depende de uno de estos puntos, hay que replicar el comportamiento observable
del Angular y anotarlo en `MIGRATION.md §Bloqueos` solo si no se puede decidir.

## Backend (forma de las respuestas)

- No hay envelope global: los endpoints devuelven la entidad o el array crudo.
- Las columnas `decimal` llegan como **string** en los GET y como **number** en los POST. Usar los
  schemas de `@/shared/domain`, que las normalizan; nunca `Number(x)` a mano en un feature.
- Las columnas `date` llegan como `YYYY-MM-DD` en los GET y como ISO de medianoche en POST/PATCH.
  Pasar siempre por `@/shared/time`.
- Los POST omiten las claves nullable que no se mandaron: la clave falta, no viene en `null`.
- `POST /personas/educadores` devuelve `passwordHash`. El schema zod lo descarta: nunca mostrar ni
  loguear la respuesta cruda.
- `/reportes/deudas` es `@Public()`.
- `auth/logout` sin `refreshToken` responde 400 ("revocar todas las sesiones" no funciona).
- `?soloActivos=false` se interpreta como `true`: para "todos", **omitir** el parámetro.
- El estado de inscripción `bonificado` nunca llega desde el backend.
- "Educadores" como filtro aparece con 3 grafías según el endpoint: `educadores`, `educador`,
  `Educadores`. Usar la constante del dominio que corresponde a cada endpoint.
- La deuda de campamento se calcula de 3 formas distintas (dashboard de persona, detalle de
  campamento, reporte de deudas). Replicar en cada pantalla la fuente que usa el Angular.

## Angular (comportamientos a replicar o no)

- `AuthUser.tipo` está mal tipado en Angular (`PROTAGONISTA`/`EDUCADOR`); el backend manda el tipo
  de persona en minúscula (`educador`). En React se usa el valor real.
- Al tipo de variante de reporte de Angular le falta `venta_mixta`; el schema de React tiene las 4.
- En Angular, si el refresh fallaba, las requests podían quedar colgadas; en React se rechazan.
- El cache "LRU" de Angular en realidad desaloja por orden de inserción; se replicó ese comportamiento.
- `positiveNumber` deja pasar el 0 y `safeText` rechaza apóstrofes ("O'Connor"). Se mantuvieron
  así por paridad; cambiarlos es una decisión de negocio.
- El ping de keep-alive no está excluido del error global: si falla, aparece un toast con el
  usuario inactivo. Se mantuvo por paridad. Para cambiarlo, poner `skipGlobalError: true` en
  `use-keep-alive.ts`.

## Plataforma React (cómo usarla bien)

- El token se adjunta y el refresh funciona solo si el árbol importa `@/shared/auth` (lo hace el
  layout protegido vía `useRequireSession`). Una página fuera de ese layout que necesite token (por
  ejemplo el reporte público con sesión) tiene que importar `@/shared/auth`.
- Todo read del cliente HTTP exige un schema zod: es el borde de validación.
