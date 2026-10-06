# Paridad — personas · cajas

> Relevado del Angular (`../frontend/src/app/modules/{personas,cajas}`) y del backend el 2026-10-06.

## personas

### Rutas (`/personas`, título "Gestión de Personas" / "Administra protagonistas, educadores y personas externas")

- `''` listado · `protagonistas/crear` · `protagonistas/:id` (ficha) · `protagonistas/:id/editar` · `educadores/crear` · `educadores/:id` (ficha) · `educadores/:id/editar` · `personas-externas/crear` · `personas-externas/:id` (detalle) · `personas-externas/:id/editar`.
- Rareza: `/personas/protagonistas`, `/personas/educadores`, `/personas/personas-externas` sin hijo → NotFound en Angular. En React: redirigen a `/personas` (desvío para no dejar links muertos; el detalle de externa vuelve ahí).
- Código muerto no migrable: ProtagonistasDetail, EducadoresDetail, ProtagonistaInfoCard, RamaSelector.

### Listado (`/personas`)

- `GET /personas` (todos, incluidos inactivos, sin agrupación, orden nombre ASC). Se separa por `tipo` en el cliente.
- Stats: "Protagonistas", "Educadores", "Personas Extras" (cuentan habilitados salvo toggle "Mostrar deshabilitados"), "Total Activos" (siempre `estado==='activo'` sobre todos — rareza, se mantiene).
- Tabs (default Manada): Manada, Unidad, Caminantes, Rovers (protagonistas de esa rama), Educadores, Externos.
- "Nuevo Miembro" → según tab `/personas/educadores/crear`, `/personas/personas-externas/crear` o `/personas/protagonistas/crear` (sin preselección de rama).
- Filtros: "Buscar" ("Buscar por nombre...", cliente, `includes` case-insensitive) y booleano "Mostrar deshabilitados" (default false). Inactivos ocultos salvo toggle.
- Columnas: "Nombre y Apellido"; "Estado" (Activo/Deshabilitado, solo con toggle); documentación booleana "Partida", "DNI", "DNI Padres", "Obra Social" (no en Educadores; Rovers sin "DNI Padres"; en Externos se muestran en false — rareza mantenida); "Acciones". Paginación cliente de 10.
- Acciones: "Ver" → `{ruta tipo}/:id`; "Editar" → `/:id/editar`; "Deshabilitar" (si no inactiva; tooltip "Deshabilitar (deja de aparecer al crear inscripciones, campamentos, etc.)"); "Rehabilitar" (si inactiva); "Eliminar" (siempre).
- Deshabilitar: confirm "Deshabilitar persona" / "`{nombre}` dejará de aparecer al crear inscripciones, campamentos, ventas o movimientos. Su historial y sus deudas pendientes siguen visibles." botón "Deshabilitar" → `PATCH /personas/:id {estado:'inactivo'}` → toast "Persona deshabilitada", actualiza fila local.
- Rehabilitar: confirm "Rehabilitar persona" / "`{nombre}` vuelve a aparecer en todas las listas." botón "Rehabilitar" → `PATCH {estado:'activo'}` → "Persona rehabilitada". Error: mensaje del back o "Error al cambiar el estado de la persona".
- Eliminar: confirmDelete con entidad protagonista|educador|persona externa → `DELETE /personas/:id` → "Persona eliminada exitosamente". 400 "No se puede eliminar: la persona es responsable de N movimiento(s)" / "… tiene N reembolso(s) registrado(s)".
- Estados: "Cargando personas..."; error sin datos (fallback "Error al cargar personas"); vacío "No se encontraron personas".

### Ficha protagonista/educador (`GET /personas/:id/dashboard`)

- 400 si no UUID, 400 "Dashboard no disponible para PersonaExterna", 404 "Persona con ID X no encontrada". Loading "Cargando datos..."; error → mensaje + "Volver" (`/personas`); sin datos "Persona no encontrada" + "Volver al listado".
- Header: nombre; meta tipo ("Protagonista"/"Educador"/"Persona Externa"/"Grupo") · rama · cargo; badge "Activo"/"Deshabilitado"; botón "Transferir a caja grupo" si `saldo > 0`; "Volver". (Angular no tiene botón Editar en la ficha.)
- Transferir: confirm "Transferir $`{saldo}` a caja grupo" / "Se transferirá el saldo de $`{saldo}` de la cuenta personal de `{nombre}` a la caja del grupo. ¿Confirmás?" botones "Transferir"/"Cancelar" → `POST /personas/:id/transferir-saldo-a-grupo` → `{saldoTransferido}` → toast "Se transfirieron $`{saldoTransferido}` a la caja del grupo" → `/personas`.
- Cards resumen: "Saldo cuenta personal" (success >0, danger <0, warning 0), "Deuda total" (danger >0), "Deuda de inscripciones", "Deuda de campamentos". (Angular sin `$` — en React se formatea como dinero, desvío visual.)
- "Documentación" (solo si `documentacionPersonal`): "Partida de Nacimiento", "DNI", "DNI Padres" (oculto en Rovers), "Carnet Obra Social" con entregado/pendiente.
- "Inscripciones": badge con deuda si `inscripciones.resumen.total > 0` (Angular leía un campo inexistente y nunca lo mostraba; se usa el real); ítems tipo (label), año, badge estado, "Saldo pendiente: $X" si >0; click → `/inscripciones/:id`; vacío "Sin inscripciones registradas".
- "Campamentos": idem, badge "Falta autorización" si `!autorizacionEntregada`; click → `/campamentos/:id`; vacío "Sin campamentos registrados".
- "Movimientos": concepto label (o texto libre del back) + "d MMM yyyy · medio" + monto con signo; vacío "Sin movimientos recientes".

### Forms

- Protagonista: "Nuevo Protagonista"/"Editar Protagonista", "Registra un nuevo protagonista en el grupo"/"Modifica los datos del protagonista". Nombre req (2–100, safeText; error "El nombre es requerido (mínimo 2 caracteres)", placeholder "Nombre completo"); Rama req ("Seleccionar rama", "La rama es requerida"); "Documentación entregada": "Partida de nacimiento", "DNI", "DNI de los padres" (oculto en Rovers, valor igual se envía), "Carnet de obra social". Botones "Cancelar" (→ `/personas`), "Crear Protagonista"/"Guardar Cambios"; "Guardando...". Crear `POST /personas/protagonistas` → "Protagonista creado exitosamente" → `/personas`. Editar `PATCH /personas/:id` → "Persona actualizada exitosamente" → `/personas`.
- Educador: "Nuevo Educador"/"Editar Educador", "Registra un nuevo educador en el grupo"/"Modifica los datos del educador". Nombre igual; Rama opcional ("Sin rama específica", hint "Opcional - Asignar a una rama específica"); Cargo req (Educador, Jefe de Rama, Jefe de Grupo; "Seleccionar cargo", "El cargo es requerido"). Solo al crear: Email (hint "Opcional — si ingresás email, la contraseña es obligatoria"; "Ingresá un email válido" / "El email es requerido si ingresás contraseña") y Contraseña ("Contraseña de acceso", hint "Mínimo 6 caracteres"; "Mínimo 6 caracteres" / "La contraseña es requerida si ingresás email"); trim y vacíos → undefined. `POST /personas/educadores {nombre, rama?, cargo, email?, password?}` → "Educador creado exitosamente" (409 "El email ya está registrado"; back exige password ≥8). Editar `PATCH {nombre, rama, cargo}` → "Educador actualizado exitosamente".
- Externa: "Nueva Persona Externa"/"Editar Persona Externa", "Registra una nueva persona externa (padre, colaborador, etc.)"/"Modifica los datos de la persona externa". Nombre igual; Contacto (max 100, hint "Opcional - Teléfono o email de contacto", placeholder "Ej: +54 11 1234-5678"); Notas (hint "Opcional - Información adicional", placeholder "Ej: Padre de Juan, disponible los sábados"). `POST /personas/externas` → "Persona externa creada exitosamente"; editar → "Persona externa actualizada exitosamente".
- React: en edición cargar con `GET /personas/:id` (Angular dependía del cache y fallaba en deep-link).

### Detalle externa (`/personas/personas-externas/:id`)

- Título "Detalle de Persona Externa"; nombre + estado; "Contacto:" y "Notas:" ('-' si vacío); editar; eliminar (confirmDelete('persona externa') → "Persona externa eliminada exitosamente" → `/personas`). Estados "Cargando...", "Persona externa no encontrada" + "Volver al listado".

## cajas

- Ruta `/cajas` (título "Gestión Financiera" / "Administra cajas, fondos de rama y cuentas personales"). Tabs default `grupo`: "Caja de Grupo", "Fondos de Rama", "Cuentas Personales", "Fondo Solidario". Cada tab recarga al volver.

### Caja de Grupo

- `GET /cajas/grupo` (404 "Caja del grupo no encontrada") + `GET /movimientos/caja/:id` (orden fecha DESC).
- Stat "Saldo Caja de Grupo" (success ≥0, danger <0).
- Botones: "Registrar Movimiento" → `/movimientos/nuevo?cajaId={id}`; "Transferir a Rama" → TransferenciaDialog (ok → recarga); "Ver Detalles" → drawer; "Ver Todos los Movimientos" → `/movimientos?caja=grupo`.
- "Últimos Movimientos": primeros 10: Fecha, Concepto, Tipo, Monto, acción "Ver" → `/movimientos/:id`. (Los filtros de Angular acá no hacen nada → no se migran.)

### Drawer de caja

- Header nombre (o "Caja de Grupo") + saldo + cerrar ("Cerrar drawer"). Toggle "Todos"/"Ingresos"/"Egresos". `GET /movimientos/caja/:id` ("Cargando movimientos..."). Fila: flecha, concepto, fecha dd/MM/yyyy, monto ±. Vacío "Sin movimientos" + "Esta caja aún no tiene movimientos registrados." / "No hay ingresos registrados en esta caja." / "No hay egresos registrados en esta caja." + CTA "Registrar primer movimiento". Footer "Ver todos" → `/movimientos?cajaId={id}`; "Registrar" → QuickMovimiento.
- **QuickMovimiento** "Nuevo Movimiento" (caja fija): `GET /personas?soloActivos=true` ("Cargando datos..."). Tipo (default Ingreso; cambia → resetea concepto), Concepto (`CONCEPTOS_MANUALES_POR_TIPO`), Monto (>0, 2 dec), Responsable, Medio (Efectivo/Transferencia), Estado (Pagado / Pendiente de Reembolso), "Persona a reembolsar" (si pendiente; precarga y sigue al responsable), "Descripción (opcional)" (max 500, safeText). `POST /movimientos {cajaId, tipo, monto, concepto, responsableId, medioPago, estadoPago, personaAReembolsarId?, descripcion?, requiereComprobante:false}` → "Movimiento registrado exitosamente"; error "Error al registrar el movimiento". Refresca el drawer.

### TransferenciaDialog (compartido con Fondo Solidario)

- "Transferir entre Cajas"; `GET /cajas` ("Cargando cajas y responsables..."). Origen fijo "Caja de Grupo" "Saldo disponible: $X". Destino req (todas menos grupo y personales; "Debe seleccionar una caja destino"). Monto req ≥0.01 ("Ingresá un monto válido mayor a cero"). Responsable = usuario logueado ("Se registra automáticamente con tu usuario"). Fecha req default hoy (BsAs). Descripción ("Motivo de la transferencia (opcional)"). Cliente: "No se pudo identificar al usuario autenticado", "Saldo insuficiente en caja de grupo (disponible: $X)". `POST /movimientos/transferencia {cajaOrigenId, cajaDestinoId, monto, responsableId, fecha, descripcion?}`. "Registrando transferencia...". Error inline (`message` o "Error al crear la transferencia"; carga: "No se pudieron cargar las cajas"). Botones "Cancelar"/"Transferir". Sin toast de éxito.

### Fondos de Rama

- `GET /cajas?tipo=rama_manada|rama_unidad|rama_caminantes|rama_rovers` (primero de cada uno). "Cargando fondos...". Stats "Total Fondos Rama" + "Fondo Manada/Unidad/Caminantes/Rovers", cada una con "+" ("Registrar Movimiento") → `/movimientos/nuevo?cajaId={id}`.
- "Movimientos de Ramas": chips multi "Todas" + 4 ramas; filtros Tipo, Concepto, Fecha (rango), limpiar. `GET /movimientos?page=1&limit=50&tipoCaja=<csv ramas>&tipo&concepto&fechaInicio&fechaFin`. Columnas Fecha, Tipo, Concepto, Descripcion, Monto, Caja, Responsable, Acciones ("Ver" → `/movimientos/:id`, "Editar" → `/movimientos/:id/editar`). Paginación cliente de 10 sobre los 50.

### Cuentas Personales

- `GET /cajas?tipo=personal[&rama=Manada|…|educadores]` (cada cambio re-consulta). Filtros "Buscar" (cliente) y "Rama" ("Todas las ramas", ramas, "Educadores"). Cuenta de propietario deshabilitado solo si `saldoActual !== 0`. Columnas "Nombre", "Rama", "Saldo", "Acciones": "Movimientos" → `/movimientos?cajaId={id}` (Angular agregaba `&tipo=personal`, inválido → se omite), "Registrar" → `/movimientos/nuevo?cajaId={id}`. Click fila → ficha del propietario. "Cargando cuentas..."; vacío "No hay personas con cuentas personales".

### Fondo Solidario

- `GET /cajas/consolidado` + `GET /cajas/fondo-solidario` (+ `GET /movimientos/caja/:id` si existe). Hint "Financia las bonificaciones. Su saldo no forma parte de la caja de grupo: sólo se libera al otorgar una bonificación."
- Stats "Saldo Disponible" y "Bonificado a la Fecha".
- Sin caja: "Crear Fondo Solidario" → `POST /cajas {tipo:'fondo_solidario', nombre:'Fondo Solidario'}` → "Caja creada exitosamente".
- Con caja: "Transferir a Fondo Solidario" → TransferenciaDialog. Tabla "Transferencias Recibidas" (concepto `transferencia_entre_cajas`): Fecha, Descripción, Responsable, Monto, "Eliminar" → runDelete('transferencia', warning "Se eliminará también el egreso correspondiente en la caja de origen. Esta acción no se puede deshacer.") → `DELETE /movimientos/:id` → recarga.

## Contratos

- `GET /personas` → STI por `tipo`: base `{id, tipo, nombre, estado, email|null, …}`; protagonista `{rama, partidaNacimiento, dni, dniPadres, carnetObraSocial}`; educador `{rama|null, cargo}`; externo `{contacto|null, notas|null}`.
- `GET /personas/:id/dashboard` → `{persona:{id,nombre,tipo,estado,rama|null,cargo?}, cuentaPersonal:{id,saldo}, documentacionPersonal|null, inscripciones:{resumen:{total,cantidad}, items:[{id,tipo,ano,estado,montoTotal,montoBonificado,montoPagado,saldoPendiente,autorizaciones?}]}, campamentos:{resumen, items:[{id(campamentoId),nombre,ano,montoTotal,montoPagado,saldoPendiente,autorizacionEntregada}]}, deudaTotal:{total,inscripciones,campamentos}, ultimosMovimientos:[{id,fecha,tipo,concepto(=descripcion??concepto),monto,medioPago}]}`.
- `POST /personas/:id/transferir-saldo-a-grupo` → `{saldoTransferido}`.
- `GET /cajas…` → `{id, tipo, nombre|null, propietarioId|null, propietario:{id,nombre,estado,rama?}|null, saldoActual, …}`.
- `GET /cajas/consolidado` → `{resumen, cajaGrupo:{id,saldo}, fondosRama:{total,detalle[{tipo,id,nombre,saldo}]}, cuentasPersonales, reembolsosPendientes, cobrosPendientes, deudasTotales, fondoSolidario:{id|null,saldo,bonificacionesOtorgadas}}`.
- `GET /movimientos/caja/:id` → `Movimiento[]`; `GET /movimientos?…` → `{data, meta}`; `POST /movimientos/transferencia` → `{egreso, ingreso}`. `monto` decimal puede llegar como string.
