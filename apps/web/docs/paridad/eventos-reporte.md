# Paridad — eventos · event-report

> Relevado del Angular y del backend el 2026-10-06.

## eventos

### Rutas

- `/eventos` lista · `crear` · `:id` detalle (`?tab=productos|ventas|entregas|movimientos`) · `:id/ventas/registrar` lote · `:id/editar`. `/eventos/:id/reporte` es público (ver event-report).

### Lista

- `GET /eventos` (fecha DESC, con `productos`). Spinner; error sin datos (fallback "Error al cargar eventos"); vacío "No hay eventos registrados" / "Comienza creando tu primer evento para gestionar ventas y actividades grupales." + "Crear Evento".
- Stats: total "Eventos", "Ventas", "Grupo" + "Crear Evento".
- Filtros cliente: "Buscar" ("Nombre del evento"), "Tipo" (Todos / "Evento de Venta" / "Evento de Grupo"). Sin resultados "No hay eventos que coincidan con los filtros."
- Card: badge tipo ("Evento de Venta"/"Evento de Grupo"), nombre, fecha `d MMM yyyy`, venta "{n} Productos", grupo `tipoEvento` + "Tipo de evento", descripción. "Ver detalle" → detalle; editar ("Editar evento"); eliminar ("Eliminar evento") → confirm "Eliminar evento" → `DELETE /eventos/:id` → "Evento eliminado exitosamente". 400 evento cerrado / movimientos externos.

### Form

- "Nuevo Evento"/"Editar Evento", "Registra un nuevo evento o venta"/"Modifica los datos del evento"; edición "Destino de ganancia: {label}", "Cargando datos del evento...", error `role=alert`.
- "Nombre"* ("Nombre del evento", 3–100, safeText, "El nombre es requerido (mínimo 3 caracteres)"); "Tipo de evento"* ("Seleccionar tipo"; Grupo, Venta; "El tipo es requerido"); "Fecha"* ("La fecha es requerida"); "Tipo de actividad grupal" (solo grupo, "Ej: reunión, salida, campito...", max 50); "Modalidad de venta" (solo crear + venta: "Un solo destino" (default) / "Mixta (destino por venta)", hint "Con modalidad mixta, cada venta elige si su ganancia va a la caja del grupo o a la cuenta personal del vendedor. Los gastos siguen siendo únicos para todo el evento."); "Destino de ganancia" (solo crear + venta + no mixta: "Cuentas Personales"/"Caja de Grupo", default caja_grupo); "Descripción" ("Descripción opcional", max 500).
- Regla a replicar: en mixta se manda igual `destinoGanancia='caja_grupo'` (sin eso el backend no genera movimientos).
- `destinoGanancia`/`modalidadVenta` solo si venta; `tipoEvento` solo si grupo; vacíos → undefined.
- Crear `POST /eventos` → "Evento creado exitosamente" → `/eventos/:id`. Editar `PATCH /eventos/:id` → "Evento actualizado exitosamente". Fallbacks "Error al crear evento"/"Error al actualizar evento". Botones "Cancelar" / "Crear Evento" | "Actualizar".

### Detalle

- Paralelo: `GET /eventos/:id`, `/kpis`, `/productos`, `/ventas`, `/movimientos`, `/entregas/stock-disponible`, `/entregas`, `GET /personas?soloActivos=true`. Tab inicial `?tab` o productos (en grupo: movimientos — Angular mostraba productos sin tab activo, se corrige).
- Estados: spinner; error + "Volver"; "Evento no encontrado".
- Header: ícono, nombre, fecha, `tipoEvento`, badge "Cerrado". Botones: "Volver"; "Ver reporte" → `/eventos/:id/reporte`; toggle "Reporte público"/"Hacer público" → `PATCH /eventos/:id/reporte-publico {reportePublico}` → "Visibilidad del reporte actualizada" (error "Error al actualizar el reporte"); "Copiar link" (si público) → "Link del reporte copiado" / "No se pudo copiar el link".
- "Habilitar movimientos" (venta, no habilitado, no cerrado): si hay productos sin costo → error "Faltan cargar los costos de: {nombres}. Cargá el precio de costo de todos los productos antes de habilitar movimientos."; confirm "¿Habilitar movimientos?" / "Se generarán los movimientos de todas las ventas ya cargadas y, a partir de ahora, cada venta generará su movimiento. Esta acción es irreversible." → `POST /eventos/:id/habilitar-movimientos` → "Movimientos habilitados exitosamente".
- Editar (no cerrado) y "Cerrar evento": confirm "¿Cerrar evento?" / "Una vez cerrado no se podrán registrar más ventas, gastos ni entregas. Esta acción es irreversible." → `POST /eventos/:id/cerrar` → "Evento cerrado exitosamente". Cerrado = todo solo lectura.
- KPIs: "Recaudado", "Ganancia Ventas", "Gastado", "Reembolsos Pendientes", "Balance"; + "Costo recuperado (grupo)" si venta con destino cuentas_personales.
- "Entregas por producto" (venta con stock): "entregado / vendido" por producto.
- Tabs: venta = Productos, Ventas, Entregas, Movimientos; grupo = Movimientos.

### Productos

- Banner si venta sin movimientos: "Movimientos pendientes: las ventas no generan movimientos todavía." + "Cargá el precio de costo de todos los productos y luego usá \"Habilitar movimientos\"." o "Ya podés usar \"Habilitar movimientos\"." Botón "Gestionar Productos". Vacío "Sin productos" / "Agregá productos para registrar ventas."
- Card: nombre, editar ("Editar producto"), eliminar ("Eliminar producto"), precio venta + "precio de venta", "costo" ("Sin costo"), "ganancia" (venta − costo, "—" sin costo), "{n} vendidas".
- Eliminar (sin confirmación) `DELETE /eventos/productos/:productoId` → "Producto eliminado exitosamente".
- Diálogo "Gestionar Productos"/"Editar Producto": "Nombre del Producto"* ("Ej: Empanadas"; "El nombre es requerido" / "Mínimo 2 caracteres"), "Precio de Costo (opcional)" ("Cargalo después si aún no lo sabés", "Debe ser un número positivo"), "Precio de Venta"* ("0.00"; "El precio de venta es requerido" / "Debe ser un número positivo"). "Cerrar" / "Agregar Producto" | "Guardar Cambios". `POST /eventos/:id/productos` → "Producto creado exitosamente"; `PATCH /eventos/productos/:productoId` → "Producto actualizado exitosamente". Con movimientos habilitados precios bloqueados: "Los movimientos ya están habilitados: los precios quedaron congelados y no se pueden modificar. Solo podés editar el nombre." y solo `{nombre}`.

### Ventas

- "Buscar por vendedor..." debounce 300 → `GET /eventos/:id/ventas?vendedor=`. "Registrar Ventas en Lote" → `/eventos/:id/ventas/registrar`. Vacío "Sin ventas registradas" / "Usá el botón de arriba para registrar ventas en lote."
- Cards agrupadas por `movimientoId` ("Ventas registradas"): vendedor (o "Sin vendedor"), fecha `d MMM`, eliminar ("Eliminar venta"), ítems "{producto} ×{cant} {ganancia}", footer "Total {u} u {ganancia}" si >1.
- Pendiente: badge "A cobrar" + "Registrar cobro" → `POST /eventos/:id/ventas/:ventaId/cobrar` (sin toast). 409 "La venta ya figura como cobrada".
- Eliminar: confirm "Eliminar venta" → `DELETE /eventos/:id/ventas/:ventaId` → si `hermanasEliminadas>0` "Se eliminó la venta junto con {n} venta(s) más del mismo lote ({n+1} en total)", si no "Venta eliminada exitosamente".

### Ventas en lote

- "Registrar Ventas en Lote" / "Seleccioná un vendedor y cargá las cantidades vendidas." `GET /eventos/:id`, `/productos`, `GET /personas/vendedores-elegibles` (única lista con agrupación).
- "Vendedor": "Responsable de las ventas"* ("Seleccioná un vendedor", "El vendedor es requerido"). Destino efectivo `cuentas_personales` → se ocultan agrupaciones y se limpia; alerta "Una agrupación (como \"Grupo Scout\") no puede tener cuenta personal: su plata siempre va a la caja del grupo." + mixta "Elegí \"Caja del Grupo\" como destino de la ganancia para esta venta." / única "Este evento tiene destino \"Cuentas Personales\": cambiálo a \"Caja del Grupo\" en el evento, o elegí una persona en vez de una agrupación como vendedor."
- "Medio de Pago": "Forma de pago"* (todas las opciones, default efectivo). Mixta: "Destino de la ganancia"* (default caja_grupo, hint "Este evento es mixto: cada venta define si su ganancia va a la caja del grupo o a la cuenta personal del vendedor.").
- Checks "Entregado en el acto" ("Si no, queda como preventa y aparece pendiente de entrega.") y "Queda a cobrar" ("La venta se registra pero la plata todavía no entró: no suma al saldo de la caja hasta que la marques como cobrada.").
- "Cantidades Vendidas": Producto | Precio Unit. | Cantidad | Subtotal; "Total General". Sin productos "No hay productos cargados para este evento." "Cancelar" (→ `?tab=ventas`) / "Registrar Ventas" ("Registrando...").
- `POST /eventos/:id/ventas/lote {vendedorId, medioPago, items:[{productoId,cantidad>0}], entregaInmediata, estadoCobro, destinoGanancia? (mixta)}` → "Ventas registradas exitosamente" → `/eventos/:id?tab=ventas`.

### Entregas

- "Buscar persona..." debounce 300 → `GET /eventos/:id/entregas?vendedor=` + `/entregas/stock-disponible?vendedor=`. Vacío "Todavía no hay ventas registradas. Una vez que registres ventas, vas a poder marcar entregas de productos acá."
- Fila por vendedor expandible con chips "{producto} {entregado}/{vendido}", "Registrar entrega" ("Registrar entrega para {nombre}") o "Todo entregado". Expandida: "Aún no se registraron entregas para este vendedor." o historial `dd/MM/yyyy HH:mm` (fecha ?? createdAt), "{cant} {producto}", notas, eliminar ("Eliminar entrega") → confirm → `DELETE /eventos/:id/entregas/:entregaId` → "Entrega eliminada exitosamente".
- Diálogo "Registrar entrega": vendedor fijo o select ("Seleccioná un vendedor", "El vendedor es requerido"); "Productos a entregar": Producto | Disponible | A entregar (≤ disponible); sin stock "Este vendedor no tiene productos con stock disponible para entregar."; "Notas (opcional)" ("Por ejemplo: quién retiró y a qué hora", "Retiró María 18:30...", max 500). `POST /eventos/:id/entregas {vendedorId, items, notas?}` → "Entrega registrada exitosamente".

### Movimientos (tab)

- "Registrar Ingreso" (solo grupo) y "Registrar Gasto". Vacío "Sin movimientos registrados" / "Usá los botones de arriba para registrar ingresos y gastos." Sub-filtros Todos/Ingresos/Egresos/Gastos (gastos = egresos sin `uso_saldo_personal`); "Sin movimientos para este filtro".
- Card de movimiento con badge "Pendiente de Reembolso" clickeable → confirm "Confirmar pago de reembolso" / "¿Confirmás que este gasto fue reembolsado?" (Monto, Descripción, Responsable; botón "Pagar") → `PATCH /movimientos/:id {estadoPago:'pagado'}`.
- Eliminar → confirm "Eliminar movimiento" → `DELETE /movimientos/:id` → "Movimiento eliminado exitosamente".
- Ingreso (grupo): "Monto"_, "Descripción"_ ("Ej: Venta de rifas, cuotas, etc."), "Responsable"_, "Medio de Pago"_ (Efectivo/Transferencia/Saldo Personal/Mixto) → `POST /eventos/:id/ingresos` → "Ingreso registrado exitosamente".
- Gasto: mismo form que campamentos (ver `campamentos-reportes-configuracion.md`) → `POST /eventos/:id/gastos` → "Gasto registrado exitosamente". React recarga movimientos y KPIs tras ingreso/gasto.

## event-report

- Ruta pública `/eventos/:id/reporte` (sin shell). Con tokens → `GET /eventos/:id/reporte`; sin tokens → `GET /eventos/:id/reporte/publico` con `skipGlobalError`.
- Estados: spinner; anónimo + 404 → "Reporte no disponible" / "Este reporte todavía no es público. Pedile al grupo que lo active, o iniciá sesión si sos parte del equipo." + "Iniciar sesión" → `/login`; otro error → "No se pudo cargar el reporte del evento.".
- Con sesión: "Volver al evento" → `/eventos/:id`.
- Variantes: grupo, venta_caja_grupo, venta_cuentas_personales, venta_mixta. Secciones por variante: venta = header, kpis, resultado, productos, por-tipo, ranking, detalle, stock, horarios, rama, [ganancia-persona en personales/mixta], [pendiente-pago], egresos, integridad; grupo = header, kpis, resultado, ingresos, [pendiente-pago], egresos, integridad.
- 1 Header: "Reporte de evento · Grupo Scout"; nombre; badges fecha, "Tipo: …", "Destino: …", "Estado: Cerrado|Abierto".
- 2 "Indicadores clave" venta: "Recaudación bruta" ("{u} unidades vendidas"), "Resultado neto real" ("Recaudación − egresos"), "Egresos" ("{n} gastos (insumos)"), "Margen neto" ("Sobre recaudación bruta"), "Vendedores" ("{e} educadores · {p} protagonistas"), "Pendiente de retiro" ("de {total} vendidas"), + "Costo recuperado por el grupo" ("Devuelto a la caja del grupo") si recupero > 0. Mixta: "Neto caja del grupo" ("{recaudado} recaudados − egresos"), "Neto cuentas personales" ("{recaudado} recaudados, sin descuento de gastos"), "A cobrar" ("Ventas registradas cuya plata todavía no entró") si pendiente. Grupo: "Ingresos", "Egresos", "Resultado neto", "Margen".
- 3 "Resultado económico": "Recaudación bruta", "− Egresos reales (insumos)", "= Resultado neto del evento".
- 4 "Productos": Producto | Costo | Venta | Unid. | Recaudado | % + donut.
- 5 "Recaudación por tipo de persona": barras + Tipo | Vend. | Unid. | Recaudado | %.
- 6 "Ranking de vendedores" ("{n} en total"): leyenda "Educador (E)" / "Protagonista (P)", barras.
- 7 "Detalle por vendedor": Vendedor | Tipo ("Educ."/"Prot.") | Rama | Unid. | Recaudado | % | Entreg. | Pend.
- 8 "Vendido vs. entregado" · "stock pendiente de retiro": tabla + TOTAL; nota "Quedan N unidades vendidas sin retirar ({pct} del total)."
- 9 "Horarios de entrega" ("{dia}, franjas de 30 min (hora AR)"): barras; vacío "Sin entregas registradas."; "{n} entrega(s) registradas fuera del día principal (excluidas del gráfico): {días}."
- 10 "Participación por rama" · "protagonistas por rama + educadores aparte": donut + Grupo | Vend. | Unid. | Recaudado | %.
- 11 "Ganancia por persona" (personales/mixta): Persona | Ganancia (cuenta personal).
- 12 "Ingresos del evento" (grupo): Concepto | Responsable | Fecha | Monto; vacío "Este evento de grupo no tiene ingresos registrados."
- 13 "Pendiente de pago" (si hay pendiente_reembolso): Concepto | Responsable | Medio | Monto + "TOTAL PENDIENTE".
- 14 "Egresos del evento": idem + "TOTAL EGRESOS".
- 15 "Integridad de datos": ALERTA / ATENCIÓN / OK + mensaje.
- Formatos: `formatArs` sin decimales; porcentajes ratio×100 con máx 1 decimal.

## Contratos

- Ya cubiertos por `src/shared/domain/evento` y `src/shared/domain/reporte` (incluye `venta_mixta` y `porDestino`). POST ingresos/gastos devuelven void. Cerrar/habilitar/reporte-publico devuelven el Evento. `ventaSchema.vendedor` conviene relajarlo a `{id, nombre}`.
