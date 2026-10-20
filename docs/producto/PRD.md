> **Nota:** copiado de `scout/docs/PRD.md` el 2026-10-20; puede tener detalles de la era Angular
> (stack, estructura de frontend, comandos `npm`/`ng`). Para el stack y la estructura actuales
> mandan `CLAUDE.md`, `docs/estructura-frontend.md` y `docs/estructura-backend.md`; para el
> contrato real, el código de `apps/api` y Swagger (`/api/docs`).

# PRD - Sistema de Gestión Financiera Scout

## 1. Resumen Ejecutivo

### 1.1 Problema
El grupo scout actualmente gestiona sus finanzas mediante hojas de Excel sincronizadas en Google Drive, enfrentando:
- Hojas desvinculadas que pierden fórmulas y referencias
- Errores humanos frecuentes al registrar movimientos
- Falta de trazabilidad de ingresos y egresos
- Dificultad para ver el estado de deudas de protagonistas
- Sin reportes claros de eventos
- Imposibilidad de conciliar caja teórica vs caja real
- Sin registro de deudas del grupo hacia personas que adelantan gastos

### 1.2 Solución Propuesta
Sistema web local (Angular + NestJS) con base de datos en Firebase/MySQL que permita:
- Gestión centralizada de caja de grupo, fondos de rama y cuentas personales
- Registro de eventos con sus ingresos y egresos
- Seguimiento de deudas (de personas al grupo y del grupo a quienes adelantan gastos)
- Reportes y trazabilidad completa
- Carga de estado inicial para migración de datos actuales

### 1.3 Usuarios
- **Administradores**: Acceso total al sistema (1-3 personas)
- Aplicación local (no expuesta a internet)
- Base de datos en Firebase (cloud) - posiblemente MySQL

---

## 2. Contexto del Dominio

### 2.1 Actores del Sistema

| Actor | Descripción | Rango de Edad |
|-------|-------------|---------------|
| **Protagonista** | Chicos que participan del grupo scout | 7-22 años |
| **Educador** | Adultos que guían a los protagonistas. Pueden estar asociados a una rama o a ninguna (ej: jefe de grupo) | 22-99 años |
| **Persona Externa** | Familiar, acompañante u otra persona que adelanta dinero para gastos del grupo y el grupo debe reembolsarle | - |
| **Administrador** | Usuario del sistema que registra movimientos (generalmente un educador) | - |

### 2.2 Estructura del Grupo

```
GRUPO SCOUT
├── Educadores (pueden o no pertenecer a una rama)
│   └── Jefe de grupo, tesoreros, etc.
│
├── Manada (rama)
│   ├── Protagonistas
│   └── Educadores de rama
│
├── Unidad (rama)
│   ├── Protagonistas
│   └── Educadores de rama
│
├── Caminantes (rama)
│   ├── Protagonistas
│   └── Educadores de rama
│
└── Rovers (rama)
    ├── Protagonistas
    └── Educadores de rama
```

- Un protagonista pertenece a exactamente una rama (puede cambiar durante el año)
- Un educador puede pertenecer a una rama o a ninguna
- Cantidad estimada: 50-100 personas entre protagonistas y educadores

### 2.3 Estructura Financiera

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CAJA DE GRUPO                                 │
│                    (Dinero colectivo principal)                         │
├─────────────────────────────────────────────────────────────────────────┤
│ Ingresos:                          │ Egresos:                           │
│ • Inscripciones Scout Argentina    │ • Pago a Scout Argentina           │
│   (cobro a familias)               │   (inscripciones federación)       │
│ • Cuotas de grupo                  │ • Gastos generales                 │
│ • Ingresos de eventos              │ • Gastos de eventos                │
│ • Ingresos de campamentos          │ • Gastos de campamentos            │
│ • Saldo de cuentas personales      │ • Reembolso a personas externas    │
│   de protagonistas que dejan grupo │                                    │
│                                    │                                    │
│ NOTA: La asignación a fondos de rama NO produce egreso de caja         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                        FONDOS DE RAMA (x4)                              │
│              (Uno por rama: Manada, Unidad, Caminantes, Rovers)         │
├─────────────────────────────────────────────────────────────────────────┤
│ Ingresos:                          │ Egresos:                           │
│ • Asignación inicial de año        │ • Gastos propios de la rama        │
│   (NO es egreso de caja grupo)     │ • Materiales, actividades, etc.    │
│                                    │                                    │
│ * El saldo persiste año a año      │                                    │
│ * Los gastos pueden salir del fondo de rama (se indica al registrar)   │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                       CUENTAS PERSONALES                                │
│           (Una por cada protagonista y educador - independiente)        │
├─────────────────────────────────────────────────────────────────────────┤
│ Ingresos:                          │ Egresos:                           │
│ • Ganancia de eventos de venta     │ • Pago de campamentos              │
│   (suma de: precio venta - costo   │ • Cursos (educadores)              │
│   de cada producto vendido)        │ • Insignias (educadores)           │
│                                    │ • Actividades varias               │
│ * Si deja el grupo → saldo va a    │                                    │
│   caja de grupo                    │                                    │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                       DEUDAS A PERSONAS EXTERNAS                        │
│        (Reembolsos pendientes a quienes adelantaron gastos)             │
├─────────────────────────────────────────────────────────────────────────┤
│ Se genera cuando:                  │ Se cancela cuando:                 │
│ • Alguien adelanta dinero para     │ • El grupo reembolsa a la persona  │
│   un gasto del grupo               │                                    │
│ • El gasto puede registrarse como  │                                    │
│   pagado o pendiente de reembolso  │                                    │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.4 Principio de Cálculo de Saldos

**IMPORTANTE**: Los saldos de todas las cajas/fondos/cuentas se calculan siempre a partir de los movimientos registrados (no se guardan como atributos). Esto permite:
- Modificar movimientos sin inconsistencias
- Trazabilidad completa
- Auditoría precisa

---

## 3. Funcionalidades

### 3.1 Gestión de Personas

#### F1. CRUD de Protagonistas
- Crear, editar, visualizar y dar de baja protagonistas
- Datos: nombre completo, rama actual, estado (activo/inactivo), fecha de ingreso
- **Campo "fue bonificado"** (booleano):
  - Por defecto `false` al crear un protagonista nuevo
  - Indica si ya usó su bonificación de inscripción Scout Argentina
  - Una vez que paga/completa una inscripción, pasa a `true`
  - A partir de ahí, siempre debe pagar inscripción
- Al dar de baja (baja lógica, nunca física):
  - Transferir saldo de cuenta personal a caja de grupo
  - No aparece en listas de inscripciones ni eventos nuevos
  - **SÍ aparece si tiene deudas pendientes con el grupo**

#### F2. CRUD de Educadores
- Crear, editar, visualizar y dar de baja educadores
- Datos: nombre completo, rama asociada (opcional, puede ser ninguna), estado (activo/inactivo)
- Manejo de cuenta personal similar a protagonistas
- Mismas reglas de baja que protagonistas

#### F3. CRUD de Personas Externas
- Crear, editar, visualizar personas externas
- Datos: nombre completo, contacto (opcional), notas
- Ver historial de gastos adelantados y reembolsos recibidos
- Ver saldo pendiente de reembolso

### 3.2 Gestión de Cajas y Fondos

#### F4. Caja de Grupo
- Visualizar saldo actual (calculado de movimientos)
- Historial completo de movimientos
- Filtros por fecha, tipo de movimiento, concepto
- Conciliación con caja física

#### F5. Fondos de Rama
- Uno por cada rama (Manada, Unidad, Caminantes, Rovers)
- Visualizar saldo actual de cada fondo (calculado de movimientos)
- Historial de movimientos por fondo
- Asignación inicial de año (no afecta caja de grupo)
- Al registrar un gasto, poder indicar que sale del fondo de rama

#### F6. Cuentas Personales
- Visualizar saldo de cada protagonista/educador (calculado de movimientos)
- Historial de movimientos individual
- Vista general de todas las cuentas personales

#### F7. Deudas a Personas Externas
- Listado de reembolsos pendientes
- Detalle por persona: monto adeudado, concepto, fecha
- Registrar reembolso (total o parcial)
- Historial de reembolsos realizados

### 3.3 Cobros Anuales

#### F8. Inscripción Scout Argentina
- Configurar monto de inscripción por año
- Asignar a qué protagonistas/educadores aplica
- **Bonificación automática**:
  - El sistema consulta el campo "fue bonificado" del protagonista
  - Si `false`: puede aplicar bonificación (no genera deuda)
  - Si `true`: debe pagar (genera deuda normalmente)
  - Al completar/pagar la inscripción, el campo pasa a `true`
- Registrar pagos (total o en múltiples pagos)
- Medios de pago: efectivo, transferencia
- Ver estado de pago de cada persona
- Reporte de deudores
- **Egreso correspondiente**: registrar pago del grupo a Scout Argentina

#### F9. Cuota de Grupo
- Similar a inscripción (sin bonificación)
- Puede haber más de una cuota en el año
- Financiación en cuotas según necesidad de cada familia
- Seguimiento de pagos y deudas

### 3.4 Eventos

#### F10. Eventos de Venta
- Crear evento (nombre, fecha, descripción)
- **Destino de ganancia**: cuenta personal de participantes O caja de grupo
- **Múltiples productos**: cada producto tiene precio de costo y precio de venta
- Registrar cantidad vendida por producto por cada participante
- Ganancia por persona = suma de (precio venta - costo) × cantidad de cada producto
- **Participantes**: todos los miembros activos participan, solo se registran ventas de quienes venden
- **Ingresos adicionales**: registrar otros ingresos del evento
- **Egresos**: registrar gastos del evento
  - Indicar si requiere comprobante (por defecto: sí)
  - Si requiere: indicar si se entregó o no el comprobante
  - Indicar quién realizó el gasto (educador, protagonista o persona externa)
  - Indicar si está pagado o pendiente de reembolso
- Reporte del evento: total vendido, ganancia total, ganancia por persona, ingresos, egresos, resultado neto

#### F11. Eventos de Grupo
- Crear evento (nombre, fecha, descripción, tipo: cena, kermesse, etc.)
- Registrar ingresos: entradas, ventas, donaciones
- Registrar egresos: compras, gastos varios
  - Indicar si requiere comprobante (por defecto: sí)
  - Si requiere: indicar si se entregó o no el comprobante
  - Indicar quién realizó el gasto
  - Indicar si está pagado o pendiente de reembolso
- Reporte del evento: ingresos totales, egresos totales, resultado neto

#### F12. Campamentos
Entidad separada de eventos para mayor flexibilidad.

- Crear campamento (nombre, fechas, costo por persona)
- **Cuotas base**: definir cantidad de cuotas sugeridas (informativo, no restrictivo)
- Definir participantes (no todos participan de todos los campamentos)
- **Pagos flexibles**: registrar tantos pagos como sean necesarios por participante
  - No limitado a la cantidad de cuotas base
  - Permite adaptarse a la realidad económica de cada familia
  - Desde cuenta personal, efectivo/transferencia, o combinación
- Registrar gastos del campamento:
  - Comida, transporte, materiales
  - Indicar si requiere comprobante
  - Indicar quién realizó el gasto
  - Indicar si está pagado o pendiente
- Ver estado de pago de cada participante (monto total, pagado, pendiente)
- Reporte: recaudación, gastos, resultado (idealmente neutro, pero puede ser positivo o negativo)

### 3.5 Gastos

#### F13. Gastos Generales (no asociados a eventos)
- Registrar gastos generales del grupo (meriendas, arreglos, materiales)
- Categorización de gastos
- **Origen del dinero**: caja de grupo o fondo de rama
- **Comprobante**:
  - Indicar si requiere comprobante (por defecto: sí)
  - Si requiere: indicar si se entregó o no
- **Responsable del gasto**: quién realizó el gasto (educador, protagonista, persona externa)
- **Estado de pago**: pagado o pendiente de reembolso
- Si pendiente: se genera deuda hacia la persona que adelantó

### 3.6 Movimientos y Trazabilidad

#### F14. Registro de Movimientos
Cada movimiento debe registrar:
- Fecha y hora
- Tipo (ingreso/egreso)
- Monto
- Concepto/descripción
- Origen/destino del dinero:
  - Caja de grupo
  - Fondo de rama (indicar cuál)
  - Cuenta personal (indicar de quién)
- Evento/campamento relacionado (si aplica)
- Medio de pago (efectivo/transferencia)
- **Responsable del movimiento**: persona relacionada al movimiento (aplica a ingresos y egresos)
  - En ingresos: quién paga (protagonista/educador)
  - En egresos: quién realizó el gasto (educador, protagonista, persona externa)
- **Comprobante** (para egresos):
  - Requiere comprobante (sí/no, default sí)
  - Comprobante entregado (sí/no, solo si requiere)
- Estado de pago (pagado/pendiente de reembolso) - solo para egresos
- Persona a reembolsar (si está pendiente)
- Usuario administrador que registró

#### F15. Búsqueda y Filtros
- Buscar movimientos por rango de fechas
- Filtrar por tipo, caja/fondo, evento, persona
- Exportar resultados

### 3.7 Reportes

#### F16. Reportes de Eventos
- Resumen de cada evento finalizado
- Indicadores: ingresos, egresos, resultado neto, participantes que vendieron (en eventos de venta)

#### F17. Reportes de Deudas (personas → grupo)
- Listado de protagonistas/educadores con deudas (incluyendo dados de baja)
- Desglose por concepto (inscripción, cuota, campamento)
- Antigüedad de la deuda

#### F18. Reportes de Reembolsos Pendientes (grupo → personas)
- Listado de personas a quienes el grupo debe dinero
- Monto total pendiente
- Detalle de cada gasto adelantado
- Historial de reembolsos

#### F19. Reportes de Caja y Fondos
- Estado de caja de grupo
- Estado de cada fondo de rama
- Movimientos del período
- Exportable a PDF/Excel

#### F20. Reportes de Cuentas Personales
- Ranking de cuentas con mayor saldo
- Movimientos por persona
- Histórico de participación en eventos

#### F21. Reporte de Comprobantes
- Listado de gastos que requieren comprobante
- Estado de entrega (entregado/pendiente)
- Filtrar por evento, fecha, responsable

### 3.8 Configuración y Administración

#### F22. Configuración Inicial / Migración
- Cargar saldo inicial de caja de grupo (como movimiento de ajuste)
- Cargar saldo inicial de cada fondo de rama
- Cargar saldo inicial de cada cuenta personal
- Cargar reembolsos pendientes a personas externas
- Importación masiva de protagonistas/educadores (opcional)

#### F23. Gestión de Períodos/Años
- Crear nuevo año/período
- Los saldos se mantienen (calculados de todos los movimientos históricos)
- Poder ver movimientos de cualquier año

#### F24. Configuración General
- Definir ramas del grupo
- Configurar categorías de gastos
- Gestión de usuarios administradores

---

## 4. Reglas de Negocio

### RN1. Protagonistas y Educadores
- Cada protagonista/educador tiene exactamente una cuenta personal (independiente de la rama)
- Un protagonista pertenece a exactamente una rama
- Un educador puede pertenecer a una rama o a ninguna
- Al dar de baja a una persona:
  - Su saldo de cuenta personal se transfiere a caja de grupo
  - No aparece en listas de inscripciones ni eventos nuevos
  - SÍ aparece en reportes de deudores si tiene deudas

### RN2. Bonificaciones de Inscripción
- Cada protagonista tiene un campo "fue bonificado" (booleano)
- Por defecto `false` al crear un protagonista nuevo en Scout Argentina
- Si `false`: puede aplicar bonificación del 100% en inscripción (no genera deuda)
- Al completar/pagar una inscripción, el campo pasa automáticamente a `true`
- A partir de ahí, siempre debe pagar inscripción (ya no puede ser bonificado)

### RN3. Pagos y Financiación
- Inscripciones, cuotas y campamentos pueden pagarse en múltiples pagos
- Los campamentos definen una cantidad de cuotas base (1, 2, 3, etc.)
- Se pueden registrar tantos pagos como sean necesarios por participante, independientemente de las cuotas base
- Esto permite flexibilidad sin configuración compleja de planes personalizados
- Los pagos pueden ser en efectivo o transferencia
- Los campamentos pueden pagarse con cuenta personal, efectivo, o combinación

### RN4. Fondos de Rama
- El saldo persiste año a año
- La asignación inicial de año NO genera egreso de caja de grupo
- Los gastos pueden indicar que salen del fondo de rama

### RN5. Eventos de Venta
- Pueden beneficiar cuentas personales o caja de grupo (configurable)
- Tienen múltiples productos, cada uno con costo y precio de venta
- Ganancia por persona = suma de (precio venta - costo) × cantidad por producto
- Todos los miembros activos participan implícitamente; solo se registran ventas efectivas

### RN6. Cálculo de Saldos
- Todos los saldos se calculan a partir de los movimientos (no se almacenan)
- Esto permite modificar movimientos sin generar inconsistencias
- Garantiza trazabilidad y auditabilidad

### RN7. Comprobantes
- Por defecto, todos los egresos requieren comprobante
- Se puede indicar que un egreso no requiere comprobante
- Si requiere comprobante, se debe registrar si fue entregado o no

### RN8. Gastos y Reembolsos
- Cada gasto debe indicar quién lo realizó (educador, protagonista, persona externa)
- Un gasto puede estar pagado (ya se desembolsó el dinero) o pendiente de reembolso
- Si está pendiente, se genera una deuda del grupo hacia quien adelantó el dinero
- El reembolso se registra como egreso de caja cuando se realiza

### RN9. Inscripción Scout Argentina (doble flujo)
- Ingreso: cobro a familias
- Egreso: pago del grupo a la federación Scout Argentina

### RN10. Trazabilidad
- Todo movimiento debe quedar registrado con fecha, usuario y detalle
- Se puede consultar el histórico completo de cualquier año
- Los movimientos no se eliminan físicamente

### RN11. Deudas de Personas al Grupo
- Una deuda se genera cuando alguien debe pagar algo (inscripción, cuota, campamento) y no lo ha hecho
- Las deudas pueden arrastrarse de años anteriores
- No hay intereses ni recargos (solo el monto original)
- Las personas dadas de baja con deuda siguen apareciendo en reportes de deudores

### RN12. Responsable de Movimientos
- Todos los movimientos (ingresos y egresos) deben registrar quién es el responsable
- En ingresos: quién realizó el pago (protagonista/educador que paga inscripción, cuota, etc.)
- En egresos: quién realizó el gasto (educador, protagonista o persona externa)

---

## 5. Casos de Uso Principales

### CU1. Registrar pago de inscripción
**Actor:** Administrador
**Flujo:**
1. Seleccionar protagonista/educador
2. Seleccionar concepto (inscripción del año X)
3. Ingresar monto pagado (puede ser parcial)
4. Seleccionar medio de pago
5. Confirmar
6. Sistema actualiza deuda y registra movimiento en caja de grupo

### CU2. Crear y gestionar evento de venta
**Actor:** Administrador
**Flujo:**
1. Crear evento con nombre, fecha
2. Definir destino de ganancia (cuentas personales o caja de grupo)
3. Agregar productos con costo y precio de venta
4. Registrar ventas: por cada miembro que vendió, indicar cantidad por producto
5. Registrar gastos del evento (con responsable, comprobante, estado de pago)
6. Registrar ingresos adicionales si los hay
7. Finalizar evento
8. Sistema calcula y distribuye ganancias según destino configurado
9. Sistema genera reporte del evento

### CU3. Registrar pago de campamento con cuenta personal
**Actor:** Administrador
**Flujo:**
1. Seleccionar campamento y participante
2. Ver monto total, pagos realizados y saldo pendiente
3. Indicar monto a pagar
4. Elegir origen: cuenta personal, efectivo, o ambos
5. Si usa cuenta personal: sistema valida saldo suficiente
6. Confirmar
7. Sistema actualiza cuenta personal y/o registra ingreso en caja de grupo

### CU4. Registrar gasto adelantado por persona externa
**Actor:** Administrador
**Flujo:**
1. Registrar gasto (concepto, monto, categoría)
2. Indicar origen: caja de grupo o fondo de rama
3. Indicar si requiere comprobante
4. Seleccionar o crear persona externa como responsable del gasto
5. Indicar estado: pendiente de reembolso
6. Sistema registra el gasto y la deuda pendiente
7. Posteriormente: registrar reembolso a la persona
8. Sistema genera egreso de caja y cancela/reduce deuda

### CU5. Dar de baja a protagonista con deuda
**Actor:** Administrador
**Flujo:**
1. Seleccionar protagonista
2. Sistema muestra deudas pendientes (si las hay)
3. Confirmar baja
4. Sistema transfiere saldo de cuenta personal a caja de grupo
5. Sistema marca protagonista como inactivo
6. Protagonista sigue apareciendo en reporte de deudores
7. No aparece en listas de nuevos eventos ni inscripciones

### CU6. Registrar múltiples pagos de campamento
**Actor:** Administrador
**Flujo:**
1. Seleccionar campamento y participante
2. Ver monto total del campamento y pagos ya realizados
3. Registrar nuevo pago (monto, medio de pago, origen)
4. Sistema actualiza saldo pendiente del participante
5. Se pueden registrar tantos pagos como sean necesarios hasta completar el monto

### CU7. Consultar deudores
**Actor:** Administrador
**Flujo:**
1. Acceder a reporte de deudas
2. Filtrar por concepto (inscripción, cuota, campamento)
3. Ver listado con nombre, monto adeudado, antigüedad
4. Lista incluye protagonistas dados de baja con deuda
5. Opcionalmente exportar a PDF/Excel

### CU8. Registrar gasto de fondo de rama
**Actor:** Administrador
**Flujo:**
1. Registrar gasto (concepto, monto, categoría)
2. Seleccionar origen: fondo de rama (ej: Manada)
3. Indicar responsable del gasto (educador de la rama)
4. Indicar si requiere comprobante y estado de entrega
5. Indicar si está pagado o pendiente
6. Sistema registra movimiento en el fondo de rama

---

## 6. Alcance MVP

### Incluido en MVP
- [x] CRUD de protagonistas y educadores
- [x] CRUD de personas externas
- [x] Gestión de caja de grupo
- [x] Gestión de fondos de rama
- [x] Gestión de cuentas personales
- [x] Gestión de reembolsos pendientes
- [x] Inscripciones (ingreso, egreso, bonificación automática) y cuotas de grupo
- [x] Eventos de venta con múltiples productos y distribución de ganancia
- [x] Eventos de grupo
- [x] Campamentos con pagos flexibles (múltiples pagos por participante)
- [x] Gastos generales (con comprobantes, estado de pago)
- [x] Registro de movimientos con trazabilidad completa (responsable en todos los movimientos)
- [x] Saldos calculados (no almacenados)
- [x] Reportes básicos en pantalla
- [x] Carga de estado inicial
- [x] Exportación a PDF/Excel

### Excluido del MVP (futuro)
- [ ] Acceso para familias
- [ ] Notificaciones automáticas de deuda
- [ ] App móvil
- [ ] Integración con MercadoPago
- [ ] Dashboard con gráficos avanzados
- [ ] Backup automático programado
- [ ] Múltiples grupos scout
- [ ] Comparativas entre eventos

---

## 7. Requisitos No Funcionales

### RNF1. Despliegue
- Frontend: Aplicación Angular ejecutable localmente
- Backend: API NestJS ejecutable localmente
- Base de datos: Firebase (posiblemente con MySQL como motor)

### RNF2. Rendimiento
- Soporte para 50-100 personas activas
- Histórico de varios años de movimientos
- Respuesta < 2 segundos para operaciones normales
- Cálculo de saldos eficiente desde movimientos

### RNF3. Usabilidad
- Interfaz simple y clara
- Navegación intuitiva
- Formularios con validación en tiempo real
- Mensajes de error descriptivos

### RNF4. Seguridad
- Autenticación de administradores
- No expuesto a internet (uso local)
- Datos sensibles en Firebase con reglas de seguridad

### RNF5. Mantenibilidad
- Código documentado
- Arquitectura modular
- Tests unitarios en funcionalidades críticas

### RNF6. Integridad de Datos
- Saldos siempre calculados, nunca almacenados
- Modificación de movimientos sin romper consistencia
- Auditoría completa de cambios

---

## 8. Glosario

| Término | Definición |
|---------|------------|
| **Protagonista** | Chico/a que participa del grupo scout (7-22 años) |
| **Educador** | Adulto que guía a los protagonistas (22+ años). Puede o no estar asociado a una rama |
| **Persona Externa** | Familiar, acompañante u otra persona que adelanta dinero para gastos del grupo |
| **Rama** | División del grupo por edades (Manada, Unidad, Caminantes, Rovers) |
| **Caja de Grupo** | Fondo común principal del grupo scout |
| **Fondo de Rama** | Fondo asignado a cada rama específica (antes llamado "caja de rama") |
| **Cuenta Personal** | Saldo individual de cada protagonista/educador, acumulado de eventos de venta |
| **Reembolso Pendiente** | Deuda del grupo hacia alguien que adelantó dinero para un gasto |
| **Evento de Venta** | Actividad donde se venden productos. La ganancia puede ir a cuentas personales o caja de grupo |
| **Evento de Grupo** | Actividad donde toda la recaudación va a la caja de grupo |
| **Campamento** | Actividad que requiere pago de participantes, admite múltiples pagos flexibles |
| **Inscripción Scout Argentina** | Cuota anual obligatoria para la federación. Genera ingreso (cobro) y egreso (pago a federación) |
| **Cuota de Grupo** | Cuota anual del grupo local |
| **Bonificación** | Exención del 100% de inscripción para protagonistas nuevos en Scout Argentina. Campo booleano "fue bonificado" controla si ya la usó |

---

## 9. Aprobación

| Rol | Nombre | Fecha | Estado |
|-----|--------|-------|--------|
| Product Owner | | | Pendiente |
| Tech Lead | | | Pendiente |

---

*Documento creado: Febrero 2026*
*Versión: 1.3*

---

## 10. Notas para el TRD

### Diseño de Cajas/Fondos/Cuentas
Se debe definir una buena abstracción para:
- Caja de grupo
- Fondos de rama (x4)
- Cuentas personales (1 por protagonista/educador)

Todas funcionan como "cajas" con movimientos, pero tienen propósitos y reglas diferentes. Evaluar si conviene una abstracción común (ej: `Wallet` o `Account`) con tipos, o entidades separadas.
