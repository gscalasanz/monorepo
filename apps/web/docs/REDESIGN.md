# REDESIGN.md — Rediseño Insignia (Fase A cerrada)

> Cierre de la Fase A (3 pilotos). Rama `feat/rediseno-insignia` (worktree `frontend-react/.claude/worktrees/rediseno-insignia`).
> **Estado:** pendiente de aprobación. La Fase B (aplicar el rediseño al resto) no empieza hasta que apruebes este documento.
>
> Fuente visual: `design-directions/insignia/mockup.html` + `screens/`. Reglas de marca: `docs/DESIGN.md`.
> Fuente funcional: el Angular (`../frontend`): ningún dato ni acción se pierde al recomponer una pantalla.

## 1. Qué se hizo

| Piloto | Rutas | Commit |
|---|---|---|
| Dashboard | `/dashboard` (+ shell: sin ancho máximo, sin barra superior, toggle de tema en el sidebar) | `c8b9e60` |
| Movimientos | `/movimientos`, `/movimientos/nuevo`, `/movimientos/:id/editar`, `FormActions` sticky | `b287ebc` |
| Ficha de persona | `/personas/protagonistas/:id` | `8b02798` |

Capturas antes / después / mockup en `docs/redesign-shots/<pantalla>/` (1440×900 y 390×844, claro y oscuro). Estado de calidad de los 3 commits: typecheck, lint, tests unitarios, build y e2e del módulo en verde.

## 2. Principios de la dirección (resumen operativo)

1. **Neutros fríos, hairlines, cifras tabulares.** La identidad scout vive en la banda del sidebar y en los colores de rama.
2. **El rojo es solo deuda o error.** Los egresos son tinta; los ingresos verdes. Un estado "pendiente" no es rojo.
3. **Componer, no decorar.** Cada pantalla: un resumen arriba (cifras) → el detalle en paneles/tablas densas. Sin tarjetas dentro de tarjetas.
4. **Todo lo que lleva a otro lado se ve y funciona como navegación**: link real + chevron (§3.7).
5. **Contenido a todo el ancho** en pantallas de datos; solo formularios y configuración quedan acotados.
6. **Mobile = misma información en lista**, no una versión recortada. Las tablas pasan a filas de dos líneas.
7. **Nada inventado.** Si el backend no devuelve un dato (totales de movimientos, DNI/edad de una persona, reembolsos de una persona), la pantalla no lo muestra; se anota como brecha (§5).

## 3. Patrones: qué usar en cada situación

Todos están en `src/shared` y registrados en `REGISTRY.md`. Antes de crear algo propio, buscar acá.

### 3.1 Encabezado de página
`PageHeader` con título + subtítulo propios de la pantalla y las acciones a la derecha. El shell ya no repite el título (no hay barra superior en desktop). Una sola acción primaria; las secundarias van en `ActionsMenu` (ver dashboard: «Acciones»).

### 3.2 Resumen en cifras
- **Una cifra principal con reparto:** `Money size="figure"` + `DistributionBar` + `ChartLegend` con links por segmento (dashboard, tesorería).
- **Franja de métricas:** `KpiStrip` (label, valor, delta/sparkline opcional, `href` para navegar). Es el patrón estándar de «lo que hay que mirar primero».
- **Progreso de una parte sobre un total:** `ProgressTrack` (fondos de rama) o la barra de la fila de obligación.

### 3.3 Paneles
`Panel` (título, `meta`, link de esquina con chevron, `headerExtra` para toggles). `flush` para listas y tablas a sangre. Estado vacío: `EmptyState` dentro del panel (no un panel vacío aparte).

### 3.4 Listas y tablas densas
- `AppDataGrid` con anchos por columna (`size`) para que ninguna columna se corte; el grid es `table-fixed`, así que **siempre definir `size`** (ver `COLUMN_SIZE` en movimientos).
- **Primera columna rica:** `DirectionTile` + nombre + sub-línea (`ConceptoCell`). Reemplaza columnas «Tipo» y «Descripción».
- Acciones por fila: `RowActionsMenu` (⋯), con nombre accesible «Acciones para {nombre}». Nada de íconos sueltos lápiz/papelera.
- Fechas cortas (`DATE_FORMATS.dayMonthPadded`, «06 oct») con la fecha completa en `title`.
- **Mobile:** `mobileRow` de dos líneas (título · «fecha · detalle») + monto a la derecha; el estado solo si no es el normal; las columnas secundarias (caja, responsable) solo en desktop. El ⋯ se mantiene: sin él no hay forma de editar/eliminar desde el celular.

### 3.5 Filtros
Una sola línea: `SegmentedTabs` (tipo) + `FilterBar` (chips punteados «+ Filtro» que pasan a chip activo con ×, «Limpiar filtros»). En mobile los chips bajan a una segunda línea. Los filtros que vienen por URL se leen de la URL (`list-params.ts`).

### 3.6 Formularios
- Alta y edición **en dos tarjetas lado a lado** desde `lg` (apiladas en mobile). La edición replica el esquema del alta: izquierda los datos de solo lectura, derecha los campos editables.
- `FormActions` es `sticky` abajo (mobile a todo el ancho; desde `md` alineado a la derecha). Nunca `fixed`: queda en el flujo y siempre se alcanza.
- Opciones con explicación → `RadioCardsField`. Selección de 2 opciones simples en una línea → `SegmentedTabs` en modo `toggle`.
- **Regla aprendida:** no cambiar la composición de un formulario que el usuario ya aprobó sin que lo pida. El alta de movimiento se dejó exactamente como estaba; se rediseñó solo la edición.

### 3.7 Navegabilidad
Todo elemento que lleva a otra pantalla es un `<a>` real y muestra `NavChevron`:
- Rutas centralizadas en `@/shared/constants/links` (`cajasHref`, `movimientosHref`, `personaHref`, `movimientoEditHref`…). No armar strings de ruta en componentes.
- Filas de lista → su detalle/edición; cifras de un resumen → la lista filtrada que las explica; encabezados de panel → la lista completa.
- Si no hay pantalla de destino honesta (p. ej. saldo de una persona), no se pone link falso.

### 3.8 Filas con estado alineado
`ObligacionItem` (ficha de persona) es el modelo: grilla de columnas fijas (ícono · título+año · **chip en columna propia** · monto · chevron). Los chips de estado nunca van pegados al final de un texto de largo variable: se desalinean.

### 3.9 Línea de tiempo
`MovimientoGroup`: grupo por mes + hilo vertical entre los `DirectionTile`; cada ítem navega a su edición.

### 3.10 Documentación / checklists
Grilla de 2 columnas; check para lo entregado (con texto solo para lectores de pantalla) y «Falta» visible solo en lo que falta.

## 4. Decisiones transversales (ya aplicadas)

- Sin barra superior en desktop; el toggle de tema vive en el sidebar junto a Configuración.
- Contenido sin `max-w`. Quedan acotados solo: Configuración (880px), detalle de persona externa y reporte público (`max-w-6xl`). **Todos los formularios** (movimiento, evento, campamento, persona, inscripción) ocupan todo el ancho en dos tarjetas.
- Sin avatar con iniciales en la ficha (el chip de rama ya identifica).
- «Registrar gasto» no tiene acceso propio en el dashboard (apuntaba a la misma ruta que «Nuevo movimiento»).
- Evolución del saldo del grupo: se arma en el front paginando `GET /movimientos` (no hay endpoint de evolución).

## 5. Brechas deliberadas respecto al mockup

| Brecha | Motivo |
|---|---|
| Buscador ⌘K, campana, «Exportar» | No existen como funcionalidad |
| Sidebar: «Dashboard» en vez de «Inicio» | Nombre que ya usa el grupo. «Cajas» y «Personas» ya reemplazaron a «Gestión Financiera» y «Gestión de Personas» (a pedido) |
| Dashboard: sin días de mora por deudor, sin nota mensual por rama, sin toggle «Ciclo», sin sparkline en «Deuda a cobrar» | El backend no devuelve esos datos |
| Dashboard: KPI strip en una columna en mobile | Legibilidad |
| Movimientos: sin barra de totales ni buscador de texto | `GET /movimientos` devuelve solo la lista, sin totales ni búsqueda; un neto de la página engaña |
| Movimientos: sin checkbox de selección | No hay acción masiva |
| Movimientos: ⋯ también en mobile | Única vía de editar/eliminar en el celular |
| Persona: sin franja DNI/edad/contacto/«en el grupo desde» | El dashboard de persona no devuelve esos datos |
| Persona: sin «Reembolsos pendientes» ni filtro de Actividad | Sin dato / sin campo para separar |
| Persona: acción «Transferir a caja grupo» en vez de «Registrar pago» | «Registrar pago» no existe en esa ficha |
| Persona: nombre «Apellido, Nombre» | Consistencia con las listas |

Caveats a tener presentes: los KPI de ingresos/egresos del mes del dashboard excluyen transferencias internas pero la lista a la que enlazan las incluye; los movimientos recientes abren el formulario de edición porque no existe una pantalla de detalle de movimiento.

## 6. Checklist de pantallas

Leyenda: ✅ hecha · 🟦 con mockup, pendiente · ⬜ sin mockup (propuesta en §7) · ➖ no requiere trabajo propio.

| Ruta | Estado | Notas |
|---|---|---|
| `/dashboard` | ✅ | |
| `/movimientos`, `/movimientos/:id` | ✅ | `:id` renderiza la misma lista |
| `/movimientos/nuevo` | ✅ | Sin cambios de composición (a pedido) |
| `/movimientos/:id/editar` | ✅ | |
| `/personas/protagonistas/:id` | ✅ | |
| `/eventos/:id` | ✅ | Los 6 KPIs con ⓘ (`KpiStrip hint`), encabezado con estado y menú ⋯, 4 pestañas como tablas en `ListPanel`. El ranking/gastos del mockup viven en el reporte |
| `/cajas` | ✅ | |
| `/inscripciones` | ✅ | |
| `/inscripciones/dashboard` | ✅ | |
| `/inscripciones/:id`, `/crear`, `/:id/editar` | ✅ | §7.4 (v2, a pedido): tarjeta «Estado de pago» protagonista (✓ Pagada en verde o «Debe $X» grande + «Pagó $A de $B» y barra) con el desglose al lado; encabezado con «Registrar pago», «Ver ficha ›» y ⋯. Bonificar ofrece como máximo lo pendiente. Edición con los datos fijos en grande. `/:id/pago` eliminada (404) |
| `/campamentos` | ✅ | §7.5 (tabla en `ListPanel`; sin barra de recaudación: la lista de la API no la trae) |
| `/campamentos/:id` | ✅ | §7.6 (pagos en fila expandible) |
| `/campamentos/crear`, `/:id/editar` | ✅ | §7.7 (dos tarjetas) |
| `/eventos` | ✅ | Tabla en `ListPanel`, fila navegable con chevron y ⋯ |
| `/eventos/crear`, `/:id/editar`, `/:id/ventas/registrar` | ✅ | `FormCard`: dos tarjetas lado a lado a todo el ancho, igual que movimientos |
| `/reportes`, `/reportes/deudas`, `/reportes/:report` | ✅ | §7.9: `KpiStrip` + `ListPanel` con filtros y `AppDataGrid` expandible (clic en la fila abre el desglose; nombre y chevron a la ficha), chips en tinta neutra y rojo solo en el total, rama como sub-línea; sin paginar (como antes). Desglose (v2): «Deudas monetarias» como filas con concepto, «Pagó $A de $B» + barra y saldo en rojo con total al pie; «Documentación» agrupada (personal · inscripción · autorizaciones de campamento) con ✓/«Falta». Placeholders: `EmptyState` dentro de un `Panel` |
| `/personas` (listado), `/personas/educadores`, `/personas/personas-externas` | ✅ | §7.10: `ListPanel` con pestañas + búsqueda + «Mostrar deshabilitados» en una línea; nombre con rama (y cargo/contacto) como sub-línea, fila navegable con ⋯ y chevron. `/educadores` y `/personas-externas` redirigen al listado (como antes) |
| `/personas/educadores/:id`, `/personas/personas-externas/:id` | ✅ | Educador: misma ficha que protagonista (sin chip de cargo repetido). Externa: mismo encabezado (`PersonaHeaderCard`) con Editar + ⋯ (Eliminar) y panel «Datos de contacto» |
| Formularios de persona (`crear`, `editar`) | ✅ | §7.7: a todo el ancho en dos tarjetas (datos | documentación · acceso · notas) con `FormActions` sticky |
| `/configuracion` | ✅ | §7.11: 880px con índice lateral (Perfil · Seguridad · Backup · Inscripciones) desde `lg`; «Mi Perfil» solo lectura; «Seguridad» con email y contraseña en dos columnas y botones del mismo ancho a la derecha; backup como filas que descargan al tocar |
| `/login` | ✅ | §7.12: sin cambios de estructura; copy del panel más corto (beneficios honestos: «Reportes de deudas»), más contraste en el texto del panel y en mobile el formulario arriba, sin hueco |
| `/eventos/:id/reporte` (público) | ✅ | Ya usa paneles, `KpiStrip` y tablas; sin cambios |

## 7. Propuestas para las pantallas sin mockup

Cada propuesta usa solo los patrones de §3 y los datos que la pantalla ya tiene hoy. Observación base: relevé la app actual (1440×900) y casi todo el trabajo es **recomponer**, no agregar datos.

### 7.1 Cajas (`/cajas`)
Hoy: pestañas Caja de Grupo / Fondos de Rama / Cuentas Personales / Fondo Solidario, un saldo suelto, 4 botones en fila y «Últimos Movimientos».
- Arriba un `KpiStrip` con las 4 cajas (saldo de cada una; cada celda navega a su pestaña). Las pestañas se mantienen (`SegmentedTabs`).
- Las 4 acciones (Registrar movimiento, Transferir a rama, Ver detalles, Ver todos los movimientos) pasan a: **Registrar movimiento** como acción primaria, el resto en `ActionsMenu`. «Ver todos» además como link de esquina del panel.
- «Últimos movimientos» con la misma tabla densa de Movimientos (`ConceptoCell`, fecha corta, fila navegable a la edición).
- Fondos de rama: lista con `ProgressTrack` como en el dashboard; cuentas personales: lista con nombre → ficha de la persona.

### 7.2 Inscripciones, listado (`/inscripciones`)
Hoy: resumen con barra por rama (bien), tabs Scout Argentina / Grupo, filtros, y una tabla con **4 columnas de papeles** (✕/✓) que se corta a la derecha.
- Mantener el resumen por rama (es el mejor ejemplo de `DistributionBar`), con cada rama como filtro/link.
- Los 4 papeles pasan a **una columna «Papeles» con contador 2/4** y detalle en tooltip; el estado de pago sigue como chip.
- Persona con `RamaChip` como sub-línea; fila entera navega al detalle con chevron; acciones en ⋯. «Ver Dashboard» como link de esquina.

### 7.3 Inscripciones, dashboard (`/inscripciones/dashboard`)
Hoy: total + distribución por rama, resumen financiero en 4 celdas, % cobrado aparte y 3 tarjetas de deudores.
- `KpiStrip` único: Inscriptos · Esperado · Pagado · Adeudado · Bonificado (cada uno con su % sobre lo esperado y barra).
- «% Cobrado» como una sola barra apilada (pagado / bonificado / adeudado) en un panel, en lugar de una tarjeta aparte.
- Las 3 tarjetas de deudores pasan a **lista de deudores** (patrón del dashboard) con link a `/reportes/deudas` ya filtrado; desglose por rama como chips con link.

### 7.4 Inscripciones, detalle, alta, edición y pago
- **Detalle:** encabezado con persona (link a ficha) + `KpiStrip` (Total, Bonificado, Pagado, Saldo) + línea de tiempo de pagos (`MovimientoGroup`) + acciones en `ActionsMenu` (Registrar pago, Editar).
- **Alta/edición/pago:** formularios en dos tarjetas como movimientos (§3.6): «a quién y cuánto» / «cómo se pagó y notas». `FormActions` sticky.

### 7.5 Campamentos, listado (`/campamentos`)
Hoy: strip de 4 contadores y tarjetas con nombre, fechas, 3 números y «Ver detalle / editar / eliminar».
- Mantener tarjetas (son pocos campamentos), pero **toda la tarjeta es un link** con chevron; editar/eliminar en ⋯.
- Reemplazar «Participantes / Costo / Cuotas» por participantes + `ProgressTrack` de recaudación (recaudado sobre total), que es lo que se mira.
- El estado (Próximo / En curso / Finalizado) sigue como chip; el strip superior puede filtrar la lista.

### 7.6 Campamentos, detalle (`/campamentos/:id`)
Hoy: tres franjas apiladas (datos, KPIs, recaudación) y **una tarjeta por participante** con sus movimientos y botones: la pantalla más larga de la app.
- Una sola franja: Costo por persona · Cuotas · Participantes + los KPI (Total a recaudar, Recaudado, Gastado, Reembolsos pendientes, Balance) y una barra de recaudación.
- Pestañas Participantes / Movimientos con contador.
- **Participantes como tabla densa:** Persona (+`RamaChip`, link a la ficha) · Pagado/Total con `ProgressTrack` · Bonificado · Estado (Al día / Pendiente / Exento) · ⋯ con Registrar pago, Ajustar/Quitar bonificación, Autorización y Quitar participante. Los movimientos de cada participante se despliegan en la fila (expandir), no ocupan lugar por defecto.
- Editar y Eliminar en el encabezado (Eliminar dentro de un menú, no suelto al pie).

### 7.7 Formularios (persona, campamento, evento, inscripción)
Aplicar el patrón de §3.6 a todos: dos tarjetas desde `lg`, secciones con título corto, `FormActions` sticky, errores bajo el campo. **Todos los formularios (persona, evento, campamento, inscripción, venta en lote) usan la misma composición que movimientos: página a todo el ancho y dos tarjetas lado a lado desde `lg`** (decisión del usuario: la estética debe ser idéntica en todos).
- **Venta en lote (`/eventos/:id/ventas/registrar`):** carga repetitiva → tabla editable (una fila por vendedor/producto) en vez de formularios apilados. Se confirma al implementarla qué trae hoy la pantalla.

### 7.8 Eventos, listado (`/eventos`)
Hoy: strip de contadores, buscador + filtro de tipo y tarjetas de 3 columnas con 3 botones.
- Misma regla que campamentos: **tarjeta navegable** con chevron y ⋯ para editar/eliminar.
- Cabecera de la tarjeta con el tipo (Venta / Grupo) y un chip de estado (Próximo / En curso / Cerrado) en lugar del banner de color; fecha y cantidad de productos como detalle.
- Mantener la lista de productos cortos que hoy aparece en algunas tarjetas solo si hay lugar; no agrandar la tarjeta por eso.

### 7.9 Reportes (`/reportes`, `/reportes/deudas`, `/reportes/:report`)
Hoy: strip (personas con deuda, deuda total, con documentos faltantes) y una tabla larga donde cada fila mezcla chips amarillos y rojos.
- Mantener el strip como `KpiStrip` (deuda total en rojo: única cifra roja).
- En la tabla, los chips de deuda pasan a **tinta neutra** y el rojo queda solo en el monto total de la fila; «N docs» como un único chip neutro.
- Fila navegable a la ficha de la persona (chevron) y expandible para ver el desglose que hoy muestra la flecha.
- Persona con `RamaChip` como sub-línea (en vez de una columna de texto «Rama»). Exportar solo si ya existe en el Angular.

### 7.10 Personas: listado y fichas de educadores / externas
- **Listado (`/personas`):** ya está cerca del mockup (strip + tabs por rama + tabla con checks). Cambios menores: columna de nombre con `RamaChip` como sub-línea, fila entera navegable con chevron, ⋯ con las acciones, búsqueda y «Mostrar deshabilitados» en la misma línea que las pestañas.
- **Ficha de educador:** reutiliza la composición de protagonista (§ficha): encabezado, saldo/deuda, obligaciones y actividad; sin documentación personal. Hoy ya comparte componentes: el trabajo es verificar ancho y alineación.
- **Ficha de persona externa:** hoy acotada a 2xl con contacto y notas. Mantener el ancho; solo alinear al encabezado nuevo (nombre, chips, acciones).

### 7.11 Configuración (`/configuracion`)
Hoy: una columna de tarjetas (perfil, cambiar email, cambiar contraseña, backup, monto de inscripciones) con botones al pie de cada una.
- Mantener ancho acotado (880px) y las tarjetas, pero con **un índice lateral** (Perfil · Seguridad · Backup · Inscripciones) fijo a la izquierda desde `lg`, que lleva a cada sección.
- «Cambiar email» y «Cambiar contraseña» agrupados en una tarjeta «Seguridad» de dos columnas; botón de guardar siempre a la derecha, mismo ancho.
- Backup y exportación: las dos opciones como filas con chevron (descargan al tocar).

### 7.12 Login (`/login`)
Hoy: panel indigo con marca y 4 beneficios + formulario centrado. Ya es coherente con la dirección.
- Solo ajustes: el panel izquierdo ya lleva el filo burgundy de la marca; se revisa el contraste del texto en claro y oscuro y se acorta el copy de beneficios. El formulario conserva ancho y errores inline. Sin cambios de estructura.

### 7.13 Reporte público de evento (`/eventos/:id/reporte`)
Hoy: sin sesión muestra «Reporte no disponible» (cuando no es público); cuando lo es, el reporte del evento.
- El reporte público usa la **misma composición del detalle de evento** (ecuación recaudación − gastos = ganancia, ventas por vendedor, gastos), en solo lectura y sin acciones, con la marca del grupo arriba. Se implementa junto con `/eventos/:id`.
- «Reporte no disponible»: estado vacío actual, con link a iniciar sesión (se mantiene).

## 8. Fase B (pendiente de tu aprobación)

Cuando apruebes este documento se redacta el texto del `/goal` de la Fase B, que:
1. Recorre las pantallas de §6 en el orden de la tabla (primero la que tiene mockup: `/eventos/:id`, después las demás por módulo).
2. Aplica los patrones de §3 y las propuestas de §7; si una propuesta necesita un dato que el backend no devuelve, lo registra en §5 y sigue.
3. Por módulo: typecheck + lint + tests + build, e2e del módulo en verde y commit `refactor(<módulo>): rediseño Insignia`.
4. **Condición de cierre:** una captura comparativa por pantalla en `docs/redesign-shots/<pantalla>/` (antes / después / mockup donde exista, 1440×900 y 390×844, claro y oscuro) y esta checklist (§6) tachada.
5. No toca `../backend`, `../frontend` ni reglas de negocio; no mergea ni pushea.
