# Paridad — movimientos · inscripciones

> Relevado del Angular y del backend el 2026-10-06.

## movimientos

### Rutas

- `''` lista ("Movimientos") · `nuevo` form ("Nuevo Movimiento") · `:id` → **la lista** (Angular no tiene detalle ruteado; paridad: `/movimientos/:id` muestra la lista) · `:id/editar` form edición.

### Lista

- Header: tabs `Todos` / `Ingresos` / `Egresos` ("Filtrar movimientos por tipo"), "{total} registros", botón "Nuevo Movimiento" → `/movimientos/nuevo`.
- Filtros (auto-apply, limpiar): "Concepto" ("Todos los conceptos", todos los `CONCEPTO_MOVIMIENTO_LABELS`), "Estado de Pago" ("Todos los estados": Pagado / Pendiente de Reembolso / A cobrar), "Rango de Fechas" → `fechaInicio`/`fechaFin`. El tipo del tab se conserva; cambiar tab/filtro vuelve a página 1.
- Server-side: `GET /movimientos?page&limit&cajaId&tipoCaja&tipo&concepto&responsableId&estadoPago&fechaInicio&fechaFin` → `{data, meta}`. Default 25 por página; opciones 10/25/50/100. "Página X de Y", "Mostrando a - b de total". Orden server `fecha DESC, createdAt DESC`.
- Query params iniciales: `cajaId`, `tipo` (activa tab), `concepto`, `fechaInicio`, `fechaFin` (en Angular se perdían por un bug de hidratación; React los respeta).
- Columnas: Fecha; Tipo ("Ingreso"/"Egreso", solo tab Todos); Concepto (label); Descripción ('-'); Monto (`formatMoney(v,2)`); Medio de Pago; Estado; Caja (`caja.nombre`); Responsable; Comprobante ("Sí"/"No" por `comprobanteEntregado`); Acciones.
- Acciones: "Editar" → `/movimientos/:id/editar`; "Eliminar" → runDelete('movimiento') → `DELETE /movimientos/:id` → "Movimiento eliminado exitosamente" → recarga página actual. Errores del back (400) se muestran en el diálogo: asociado a inscripción, pago de campamento, operación compuesta, venta, transferencia sin fondos en destino.
- Estados: "Cargando movimientos..."; error + "Reintentar"; vacío "No se encontraron movimientos" + "No hay ingresos registrados con los filtros seleccionados." / "No hay egresos registrados con los filtros seleccionados." / "No hay movimientos registrados con los filtros seleccionados."

### Form crear (`/movimientos/nuevo`)

- "Nuevo Movimiento" / "Registra un ingreso o egreso en la caja". "Cargando datos...". `GET /cajas` + `GET /personas?soloActivos=true`; `?cajaId` precarga la caja.
- `cajaId` req, buscable, "Seleccionar caja", "La caja es requerida". Label: `nombre` o según tipo "Caja del Grupo", "Fondo Manada/Unidad/Caminantes/Rovers", "Cuenta de {propietario}" / "Cuenta Personal", si no "Caja {id8}".
- `tipo` req Ingreso/Egreso (default ingreso), "El tipo es requerido".
- `monto` req, >0, 2 decimales, `$`, error "El monto es requerido".
- `concepto` req, "Seleccionar concepto", opciones `CONCEPTOS_MANUALES_POR_TIPO[tipo]` (en React, si el concepto elegido no pertenece al nuevo tipo se limpia).
- `categoria` opcional "Seleccionar categoría": Insumos, Comida, Transporte, Alquiler, Servicios, Material Didáctico, Mantenimiento, Otros.
- `responsableId` req, buscable, "El responsable es requerido".
- `medioPago` req Efectivo/Transferencia (default efectivo), "El medio de pago es requerido".
- `fecha` req, default hoy (BsAs), "La fecha es requerida".
- `descripcion` opcional, "Notas adicionales (opcional)", max 500, safeText.
- `estadoPago` req Pagado / Pendiente de Reembolso (default pagado), "El estado es requerido".
- "Persona a reembolsar" si pendiente: req, buscable, "Seleccionar persona que adelantó el dinero", "Seleccione la persona que adelantó el dinero"; precarga y sigue al responsable salvo elección manual; se limpia al salir de pendiente.
- `POST /movimientos {cajaId, tipo, monto, concepto, categoria?, descripcion?, responsableId, medioPago, requiereComprobante:false, estadoPago, personaAReembolsarId?, fecha?}` → "Movimiento registrado exitosamente" → `/movimientos`. Botones "Cancelar" / "Crear Movimiento".

### Form editar

- `GET /cajas`, `GET /personas`, `GET /movimientos/:id` (si falla → `/movimientos`). "Editar Movimiento" / "Modifica los datos editables del movimiento". Banner "Solo puedes editar la descripción, estado de pago y comprobante entregado. Los demás campos son inmutables por integridad contable."
- "Datos del Movimiento" (solo lectura): Tipo, Monto, Concepto, Medio de Pago, Fecha dd/MM/yyyy, Responsable (o "N/A"). "Campos Editables": descripción (max 500), estado (Pagado / Pendiente de Reembolso) + persona a reembolsar condicional, "Comprobante Entregado".
- `PATCH /movimientos/:id {descripcion?, comprobanteEntregado, estadoPago, personaAReembolsarId?}` → "Movimiento actualizado exitosamente" → `/movimientos`. Botón "Guardar Cambios".

### TransferenciaDialog

- Ver `personas-cajas.md` (se usa desde Cajas).

## inscripciones

### Rutas

- `''` lista · `dashboard` · `crear` · `:id` detalle · `:id/editar` · `:id/pago` (→ mismo form de edición, paridad).

### Lista

- Barra de stats (con consolidado): `total` + "Inscriptos", barra segmentada por rama (Manada, Unidad, Caminantes, Rovers, Educadores) con tooltip "Rama: n" y leyenda; botón "Ver Dashboard" → `/inscripciones/dashboard?tipoDeuda&rama`.
- Tabs "Scout Argentina" / "Grupo" (inicial `?tipo`, default `scout_argentina`). "Nueva Inscripción" → `/inscripciones/crear?tipo={tab}`.
- Filtros: "Buscar" ("Buscar por nombre...", cliente), "Año" ("Todos los años", año−1, año, año+1; default año actual), "Tipo de Deuda" (Todos / "Deuda de dinero" / "Documentación faltante" / "Dinero y documentación"), "Rama" ("Todas las ramas", ramas, "Educadores"=`educador`). Cambios → URL + `GET /inscripciones` y `GET /inscripciones/consolidado` con `{tipo, ano, tipoDeuda, rama}`.
- Tabla (cliente, 10/pág): Persona, Pagado, Pendiente, Estado (label), en SA: Declaración de Salud, Autorización de Imagen, Salidas Cercanas, Autorización de Ingreso, Cert. Aptitud Física (check/cruz); Acciones; "Fecha de inscripción".
- Acciones: Ver → `/inscripciones/:id`; Editar → `/:id/editar`; Eliminar → runDelete('inscripción') → `DELETE /inscripciones/:id` → recarga (400 "No se puede eliminar: la inscripción tiene N movimiento(s) asociado(s)").
- Estados: "Cargando inscripciones..."; vacío "No hay inscripciones para mostrar".

### Dashboard

- "Dashboard", tabs SA/Grupo, "Ver lista" → `/inscripciones`. Filtros Año / Tipo de Deuda / Rama. `GET /inscripciones/consolidado`.
- "Total Inscripciones" (`total`, sublabel año o "Todos los años"), "Distribución por Rama" (barras + "Rama: n (x.x%)").
- "Resumen Financiero": Monto Esperado, Monto Pagado, Monto Adeudado, Bonificado (% sobre esperado, tope 100, 1 decimal). "% Cobrado" con Esperado / Cobrado / Pendiente.
- "Deudores": "Deuda de Dinero" ("Personas con saldo pendiente", "Monto total"), "Documentación" ("Documentos faltantes"), "Dinero + Docs" ("Ambos tipos de deuda"), cada una "N personas" + desglose por rama >0. Footer "Actualizado: dd/MM/yyyy HH:mm".

### Form crear

- "Nueva Inscripción" / "Registra una nueva inscripción para Scout Argentina o el Grupo"; badge del año; "Preparando formulario...". `GET /personas` (filtra no inactivas) + `GET /cajas/fondo-solidario`.
- 01 "Datos de la Inscripción": persona req ("Seleccionar persona", "No hay personas disponibles", "Selecciona una persona"); tipo req (Grupo / Scout Argentina, default `?tipo` o SA, "Requerido"); año req (default actual, 2000–2100, "Requerido").
- 02 "Importes": "Persona nueva" (solo crear + SA; "La inscripción se registra sin costo: monto total en $0 y sin pagos, caja personal ni bonificación"; pone todo en 0 y deshabilita; pasar a Grupo lo desmarca). "Monto Total" deshabilitado = config localStorage (`montoByTipo`). "Pago Inicial" (≥0, "Efectivo o transferencia"). "Medio de Pago" (Efectivo/Transferencia). "Bonificación" (≥0, "Fondo Solidario: $saldo"; > saldo → "El fondo solidario no tiene saldo suficiente" y bloquea).
- "Cuenta Personal" (persona elegida): `GET /cajas/personal/:personaId/saldo` ("Consultando saldo..."); "Saldo disponible"; "Usar todo →" (min(saldo, total)); "Usar de cuenta personal" (max saldo).
- Regla: pago + saldo + bonificación ≤ total, si no "La suma de pago inicial, saldo personal y bonificación no puede superar el monto total".
- Resumen: Total − Saldo Personal − Bonificación = "A pagar".
- 03 "Autorizaciones" (solo SA) "Documentos firmados por el responsable del protagonista": Declaración de Salud ("Estado de salud y condiciones médicas"), Autorización de Imagen ("Uso de fotografías en actividades"), Salidas Cercanas ("Actividades en zonas próximas al grupo"), Autorización de Ingreso ("Permiso de participación en el movimiento"), Certificado de Aptitud Física ("Apto médico para actividades físicas").
- `POST /inscripciones {personaId, tipo, ano, montoTotal, montoPagado?, montoConSaldoPersonal?, medioPago? (si hay pago), montoBonificado?, booleans true}` → "Inscripción creada exitosamente" → `/inscripciones?tipo={tipo}`. Botones "← Cancelar" / "Crear inscripción".
- Errores back: duplicada "Ya existe una inscripción de tipo {tipo} para esta persona en el año {ano}", suma > total, saldo personal, fondo.

### Form editar

- "Editar Inscripción" / "Actualiza los datos y autorizaciones de esta inscripción"; persona/tipo/año/monto deshabilitados; solo autorizaciones. `PATCH /inscripciones/:id` con los 5 booleans **solo si es SA** (Angular mandaba siempre y Grupo daba 400 — React no manda booleans en Grupo) → "Inscripción actualizada exitosamente" → `/inscripciones`. Botón "Guardar cambios". React carga con `GET /inscripciones/:id`.

### Detalle

- `GET /inscripciones/:id`. "Cargando inscripción..."; error + "Volver"; "Inscripción no encontrada" + "Volver al listado".
- Header: persona (o "Sin nombre"), "{Tipo} · {año}", badge estado (Pendiente / "Pago Parcial" / Pagado / Bonificado), "Volver".
- Card pago: "Saldo pendiente" o "Estado de pago" "Al día"; "{pagado} pagado de {total − bonificado}"; barra % ("N% completado"), "N pago(s)"; desglose Inscripción / Bonificación −X / Total / Pagado.
- "Bonificar"/"Ajustar bonificación": diálogo "Bonificar Inscripción" con "Monto total", "Saldo Fondo Solidario" (`GET /cajas/fondo-solidario`), "Monto a Bonificar" (≥0, "Máximo: $total"; "No puede exceder el monto total", "El fondo solidario no tiene saldo suficiente" comparando el delta), "Bonificar el 100% ($total)", "Confirmar" → `PATCH /inscripciones/:id/bonificacion {monto}` → "Bonificación otorgada exitosamente".
- "Quitar bonificación" (si >0, sin confirmación) → `DELETE /inscripciones/:id/bonificacion` → "Bonificación quitada exitosamente".
- Historial: "+ Pago" si pendiente >0; ítems monto (− si egreso), fecha 'd MMM', concepto, medio; editar solo ingresos `inscripcion_scout_argentina|inscripcion_grupo`; vacío "Sin pagos" / "Registrá el primer pago".
- Registrar Pago: `GET /cajas/personal/:personaId/saldo`; "Saldo Pendiente"; "Pago en Efectivo/Transferencia"; "Medio de Pago" ("Seleccione un medio de pago"); "Usar Saldo Personal" ("Excede el saldo disponible ($X)", "Disponible: $X", "Usar todo", "Sin saldo disponible"); "Descripción" ("Notas adicionales..."); resumen Efectivo + Saldo = Total, "Restante"; > pendiente "El monto total no puede superar el saldo pendiente ($X)". `POST /inscripciones/:id/pagar {montoPagado, montoConSaldoPersonal?, medioPago, descripcion?}` → "Pago registrado exitosamente".
- Editar Pago: "Pago Original", "Fecha", "Saldo Pendiente Actual"; "Monto del Pago" (≥1, ≤ pendiente + original), Medio, Descripción; "Eliminar" / "Cancelar" / "Guardar Cambios". Guardar `PATCH /movimientos/:movId {monto, medioPago, descripcion?}` → "Pago actualizado exitosamente". Eliminar (sin confirmación) `DELETE /inscripciones/:id/pagos/:movimientoId` → "Pago eliminado exitosamente".
- Autorizaciones (SA): todas → "Listo para actividades" / "Todo completado"; si no "Pendientes" / "N de 5"; grid Salud, Imagen, Salidas, Ingreso, Apto Físico.
- Footer: "Eliminar" (confirmDelete → DELETE → toast "Inscripción eliminada exitosamente" → `/inscripciones`), "Editar inscripción".

## Contratos

- `GET /movimientos` → `{data: Movimiento[], meta:{page,limit,total,totalPages,hasPreviousPage,hasNextPage}}`; `Movimiento.monto` decimal string.
- `GET /inscripciones?ano&tipo&tipoDeuda&rama` → `InscripcionResponse[]` `{id, personaId, tipo, ano, montoTotal, montoBonificado, 5 booleans, estado: pendiente|parcial|pagado, montoPagado, saldoPendiente, persona?:{id,nombre,tipo,rama}, movimientos:[{id,monto,medioPago,fecha,descripcion,tipo,concepto}], createdAt, updatedAt}`.
- `GET /inscripciones/consolidado` → `{filtros, total, porRama:{total,manada,unidad,caminantes,rovers,educadores}, financiero:{montoEsperado,montoPagado,montoAdeudado,montoBonificado}, deudores:{dinero:{total,monto,porRama}, documentacion:{total,porRama}, ambos:Distribucion}, fecha}`.
- `GET /cajas/personal/:personaId/saldo` → `{saldo}`.
