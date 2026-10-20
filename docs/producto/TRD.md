> **Nota:** copiado de `scout/docs/TRD.md` el 2026-10-20; puede tener detalles de la era Angular
> (stack, estructura de frontend, comandos `npm`/`ng`). Para el stack y la estructura actuales
> mandan `CLAUDE.md`, `docs/estructura-frontend.md` y `docs/estructura-backend.md`; para el
> contrato real, el código de `apps/api` y Swagger (`/api/docs`).

# TRD - Technical Requirements Document (v2.0)
## Sistema de Gestión Financiera Scout - Angular v21 + NestJS + PostgreSQL

> **Versión**: 2.0
> **Fecha**: Febrero 2026
> **Estado**: En revisión arquitectónica
> **Crítico**: Sin `any`, sin magic strings, sin componentes gigantes, PATCH no PUT

---

## 1. Visión Técnica

Crear un sistema local (Angular v21 + NestJS + PostgreSQL con Neon) que maneje la complejidad financiera del grupo scout manteniendo:
- ✅ Integridad de datos con tipado estricto
- ✅ Trazabilidad completa de movimientos
- ✅ Saldos calculados dinámicamente (nunca almacenados)
- ✅ Arquitectura modular e independiente
- ✅ Performance optimizado con Signals y OnPush
- ✅ Componentes pequeños y reutilizables

---

## 2. Stack Tecnológico

### Frontend
- **Framework**: Angular 21 (latest)
- **Lenguaje**: TypeScript 5.x (strict mode ON)
- **UI Library**: Angular Material 21
- **State Management**: Signals + ChangeDetectionStrategy.OnPush
- **HTTP Client**: Angular HttpClient + interceptors
- **Forms**: Reactive Forms con validación dual
- **Testing**: Jest + Testing Library
- **Build**: Angular CLI con esbuild

### Backend
- **Framework**: NestJS
- **Lenguaje**: TypeScript (strict mode ON)
- **ORM**: TypeORM
- **Database**: PostgreSQL (Neon - https://console.neon.tech)
- **Validación**: class-validator + class-transformer
- **Testing**: Jest
- **Patterns**: Single Table Inheritance, soft deletes, PATCH no PUT

### Infrastructure
- **Frontend**: Local (Windows/Mac/Linux)
- **Backend**: Local (Windows/Mac/Linux)
- **Database**: Neon PostgreSQL (cloud, gratuito)
- **Connection**: Via `neonctl` + connection string

---

## 3. Arquitectura

### 3.1 C4 - Nivel de Sistema

```
┌─────────────────────────────────────────────┐
│         USUARIO (Admin Scout)                │
└────────────────┬────────────────────────────┘
                 │
        ┌────────▼─────────┐
        │   Angular App    │
        │   (Local PC)      │
        │   Port 4200       │
        └────────┬─────────┘
                 │ HTTP REST
        ┌────────▼─────────┐
        │   NestJS API     │
        │   (Local PC)      │
        │   Port 3000       │
        └────────┬─────────┘
                 │ TypeORM
        ┌────────▼─────────┐
        │   PostgreSQL     │
        │   (Neon Cloud)    │
        │   sa-east-1      │
        └──────────────────┘
```

### 3.2 Capas Backend

```
┌────────────────────────────────────────────┐
│       CONTROLLERS (HTTP Layer)              │
│   Valida entrada, devuelve JSON tipado     │
├────────────────────────────────────────────┤
│       SERVICES (Business Logic)             │
│   Reglas, orquestacion, calculos            │
├────────────────────────────────────────────┤
│       REPOSITORIES (Data Layer)             │
│   TypeORM queries, transacciones            │
├────────────────────────────────────────────┤
│       ENTITIES (Domain Layer)               │
│   Single Table Inheritance (Persona)        │
│   Caja (CajaType enum)                     │
│   Movimiento (concepto enum, sin magic)     │
└────────────────────────────────────────────┘
```

### 3.3 Estructura Backend

```
src/
├── common/
│   ├── entities/
│   │   ├── base.entity.ts              # Base con soft deletes
│   │   └── enums.ts                     # Enums globales
│   ├── dtos/
│   │   └── api-response.dto.ts          # Response global tipado
│   ├── filters/
│   │   └── http-exception.filter.ts
│   ├── interceptors/
│   │   └── transform.interceptor.ts
│   ├── decorators/
│   │   └── current-user.decorator.ts
│   └── utils/
│       └── constants.ts                 # SIN MAGIC STRINGS
│
├── modules/
│   ├── personas/
│   │   ├── entities/
│   │   │   └── persona.entity.ts        # Protagonista, Educador, PersonaExterna
│   │   ├── dtos/
│   │   │   ├── create-persona.dto.ts
│   │   │   └── update-persona.dto.ts
│   │   ├── services/
│   │   │   └── personas.service.ts
│   │   ├── repositories/
│   │   │   └── personas.repository.ts
│   │   ├── controllers/
│   │   │   └── personas.controller.ts
│   │   └── personas.module.ts
│   │
│   ├── cajas/
│   │   ├── entities/
│   │   │   └── caja.entity.ts           # Unificada con CajaType
│   │   ├── services/
│   │   │   ├── cajas.service.ts         # Logica de cajas
│   │   │   └── saldo-calculator.ts      # Calcula dinámicamente
│   │   ├── controllers/
│   │   │   └── cajas.controller.ts
│   │   └── cajas.module.ts
│   │
│   ├── movimientos/
│   │   ├── entities/
│   │   │   └── movimiento.entity.ts     # Concepto enum (no string)
│   │   ├── dtos/
│   │   │   └── create-movimiento.dto.ts
│   │   ├── services/
│   │   │   └── movimientos.service.ts
│   │   └── movimientos.module.ts
│   │
│   ├── inscripciones/
│   ├── campamentos/
│   ├── eventos/
│   ├── reportes/
│   └── ... más módulos
│
└── database/
    ├── migrations/
    └── seeds/
```

### 3.4 Estructura Frontend

```
src/app/
├── shared/                               # Solo reutilizable
│   ├── enums/
│   │   ├── index.ts
│   │   ├── rama.enum.ts                 # 'Manada' | 'Unidad' | ...
│   │   ├── estado.enum.ts               # 'activo' | 'inactivo'
│   │   ├── tipo-movimiento.enum.ts      # 'ingreso' | 'egreso'
│   │   ├── tipo-caja.enum.ts            # enum completo
│   │   └── ... más enums
│   │
│   ├── constants/
│   │   ├── index.ts
│   │   ├── api.constants.ts             # URLs, versión API
│   │   ├── ui.constants.ts              # Timeouts, sizes
│   │   └── messages.constants.ts        # Textos UI
│   │
│   ├── models/
│   │   ├── api-response.model.ts        # Tipado genérico
│   │   ├── pagination.model.ts
│   │   └── form-error-detail.model.ts
│   │
│   ├── services/
│   │   ├── http.service.ts              # Wrapper tipado HttpClient
│   │   ├── notification.service.ts      # Toasts/snackbars
│   │   ├── cache.service.ts
│   │   └── form-builder.service.ts
│   │
│   ├── components/
│   │   ├── form-error/                  # Mostrar errores validación
│   │   ├── virtual-list/                # Para listas > 100 items
│   │   ├── loading-spinner/
│   │   └── empty-state/
│   │
│   ├── pipes/
│   ├── directives/
│   └── interceptors/
│       ├── auth.interceptor.ts
│       ├── error.interceptor.ts
│       └── loading.interceptor.ts
│
├── modules/
│   ├── auth/
│   │   ├── services/
│   │   │   └── auth-state.service.ts    # Signals para usuario
│   │   ├── guards/
│   │   │   └── auth.guard.ts
│   │   └── ... componentes small
│   │
│   ├── personas/
│   │   ├── enums/
│   │   │   └── personas-messages.enum.ts # Mensajes específicos
│   │   │
│   │   ├── services/
│   │   │   ├── personas-api.service.ts  # Solo HTTP
│   │   │   ├── personas-state.service.ts # Signals + estado
│   │   │   └── personas-form.builder.ts # Validadores reutilizables
│   │   │
│   │   ├── models/
│   │   │   ├── persona.model.ts
│   │   │   ├── protagonista.model.ts
│   │   │   ├── educador.model.ts
│   │   │   └── persona-externa.model.ts
│   │   │
│   │   ├── components/
│   │   │   ├── protagonistas/
│   │   │   │   ├── list/                # Smart - max 150 líneas
│   │   │   │   │   ├── protagonistas-list.component.ts
│   │   │   │   │   ├── protagonistas-list.component.html
│   │   │   │   │   └── components/
│   │   │   │   │       ├── protagonista-row.component.ts (max 80)
│   │   │   │   │       ├── protagonista-filters.component.ts (max 100)
│   │   │   │   │       └── protagonista-empty-state.component.ts
│   │   │   │   ├── form/                # Smart - max 200 líneas
│   │   │   │   │   ├── protagonistas-form.component.ts
│   │   │   │   │   └── components/
│   │   │   │   │       ├── datos-personales-section.component.ts
│   │   │   │   │       └── rama-selector.component.ts
│   │   │   │   └── detail/              # Smart - max 150 líneas
│   │   │   ├── educadores/
│   │   │   └── personas-externas/
│   │   │
│   │   ├── personas.routes.ts           # Lazy loading
│   │   └── personas.module.ts
│   │
│   ├── cajas/
│   ├── movimientos/
│   ├── eventos/
│   ├── campamentos/
│   ├── reportes/
│   ├── configuracion/
│   └── dashboard/
│
├── core/                                # Singleton services
│   ├── services/
│   │   ├── auth.service.ts              # JWT, usuario actual
│   │   └── error-handler.service.ts
│   ├── guards/
│   │   ├── auth.guard.ts
│   │   ├── unsaved-changes.guard.ts
│   │   └── role.guard.ts
│   └── interceptors/
│       └── (registrados en app.config.ts)
│
├── signals/                             # Estado global
│   ├── auth.signals.ts                  # Usuario actual, token
│   ├── ui.signals.ts                    # Loading global, sidebar
│   └── app-state.signals.ts             # Estado compartido app
│
├── app.routes.ts                        # Routing standalone
├── app.config.ts                        # Providers, interceptors
└── app.component.ts                     # Root
```

---

## 4. Modelo de Datos

### 4.1 Entidades Backend

#### Persona Unificada (Single Table Inheritance)

```typescript
// common/entities/base.entity.ts
export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;  // Soft delete
}

// modules/personas/entities/persona.entity.ts
export type TipoPersona = 'protagonista' | 'educador' | 'externo';

@Entity('personas')
@TableInheritance({ column: { type: 'varchar', name: 'tipo' } })
export abstract class Persona extends BaseEntity {
  @Column()
  nombre: string;

  @Column({ type: 'enum', enum: EstadoPersona })
  estado: EstadoPersona;  // 'activo' | 'inactivo'

  @Column({ type: 'date' })
  fechaIngreso: Date;

  @OneToOne(() => Caja, { nullable: true })
  @JoinColumn()
  cuentaPersonal?: Caja;

  @Column({ type: 'varchar' })
  tipo: TipoPersona;
}

@ChildEntity('protagonista')
export class Protagonista extends Persona {
  @Column({ type: 'enum', enum: Rama })
  rama: Rama;

  @Column({ default: false })
  fueBonificado: boolean;
}

@ChildEntity('educador')
export class Educador extends Persona {
  @Column({ type: 'enum', enum: Rama, nullable: true })
  rama?: Rama;
}

@ChildEntity('externo')
export class PersonaExterna extends Persona {
  @Column({ nullable: true })
  contacto?: string;

  @Column({ nullable: true })
  notas?: string;
}
```

#### Caja Unificada

```typescript
// modules/cajas/entities/caja.entity.ts
export enum CajaType {
  GRUPO = 'grupo',
  RAMA_MANADA = 'rama_manada',
  RAMA_UNIDAD = 'rama_unidad',
  RAMA_CAMINANTES = 'rama_caminantes',
  RAMA_ROVERS = 'rama_rovers',
  PERSONAL = 'personal'
}

@Entity('cajas')
export class Caja extends BaseEntity {
  @Column({ type: 'enum', enum: CajaType })
  tipo: CajaType;

  @Column({ nullable: true })
  nombre?: string;

  @ManyToOne(() => Persona, { nullable: true })
  @JoinColumn()
  propietario?: Persona;  // Solo si es PERSONAL

  @OneToMany(() => Movimiento, (m) => m.caja)
  movimientos: Movimiento[];

  // NO guardar saldoActual - se calcula siempre
}
```

#### Movimiento (Concepto es ENUM, no string)

```typescript
// common/entities/enums.ts
export enum ConceptoMovimiento {
  INSCRIPCION = 'inscripcion',
  CUOTA_GRUPO = 'cuota_grupo',
  CAMPAMENTO_PAGO = 'campamento_pago',
  CAMPAMENTO_GASTO = 'campamento_gasto',
  EVENTO_VENTA_INGRESO = 'evento_venta_ingreso',
  EVENTO_VENTA_GASTO = 'evento_venta_gasto',
  EVENTO_GRUPO_INGRESO = 'evento_grupo_ingreso',
  EVENTO_GRUPO_GASTO = 'evento_grupo_gasto',
  GASTO_GENERAL = 'gasto_general',
  REEMBOLSO = 'reembolso',
  AJUSTE_INICIAL = 'ajuste_inicial',
  AJUSTE_BONIFICACION = 'ajuste_bonificacion'
}

export enum EstadoPago {
  PAGADO = 'pagado',
  PENDIENTE_REEMBOLSO = 'pendiente_reembolso'
}

// modules/movimientos/entities/movimiento.entity.ts
@Entity('movimientos')
export class Movimiento extends BaseEntity {
  @ManyToOne(() => Caja, (c) => c.movimientos)
  @JoinColumn()
  caja: Caja;

  @Column({ type: 'enum', enum: TipoMovimiento })
  tipo: TipoMovimiento;  // 'ingreso' | 'egreso' (constante)

  @Column('decimal', { precision: 10, scale: 2 })
  monto: number;

  @Column({ type: 'enum', enum: ConceptoMovimiento })
  concepto: ConceptoMovimiento;  // Categoría fija

  @Column({ nullable: true })
  descripcion?: string;  // Texto libre, contexto

  @ManyToOne(() => Persona)
  @JoinColumn()
  responsable: Persona;  // Quién hizo el movimiento

  @Column({ type: 'enum', enum: MedioPago })
  medioPago: MedioPago;  // 'efectivo' | 'transferencia'

  @Column({ default: true })
  requiereComprobante: boolean;

  @Column({ nullable: true })
  comprobanteEntregado?: boolean;

  @Column({ type: 'enum', enum: EstadoPago })
  estadoPago: EstadoPago;

  @ManyToOne(() => Persona, { nullable: true })
  @JoinColumn()
  personaAReembolsar?: Persona;  // Si estadoPago = pendiente

  @Column({ type: 'timestamptz' })
  fecha: Date;

  // Referencias opcionales
  @ManyToOne(() => Evento, { nullable: true })
  evento?: Evento;

  @ManyToOne(() => Campamento, { nullable: true })
  campamento?: Campamento;

  @ManyToOne(() => Inscripcion, { nullable: true })
  inscripcion?: Inscripcion;
}
```

#### Bonificación con Trazabilidad

```typescript
// modules/inscripciones/entities/inscripcion.entity.ts
export enum EstadoInscripcion {
  PENDIENTE = 'pendiente',
  PARCIAL = 'parcial',
  PAGADO = 'pagado',
  BONIFICADO = 'bonificado'
}

@Entity('inscripciones')
export class Inscripcion extends BaseEntity {
  @ManyToOne(() => Persona)
  @JoinColumn()
  persona: Persona;

  @Column()
  ano: number;

  @Column('decimal', { precision: 10, scale: 2 })
  montoTotal: number;

  @Column('decimal', { precision: 10, scale: 2 })
  montoBonificado: number;  // 0 o montoTotal

  @Column('decimal', { precision: 10, scale: 2 })
  montoPagado: number;

  @Column({ type: 'enum', enum: EstadoInscripcion })
  estado: EstadoInscripcion;

  @OneToMany(() => PagoInscripcion, (p) => p.inscripcion)
  pagos: PagoInscripcion[];

  @OneToOne(() => Movimiento, { nullable: true })
  movimientoBonificacion?: Movimiento;  // Si fue bonificada
}

interface PagoInscripcion {
  id: string;
  monto: number;
  medioPago: MedioPago;
  fecha: Date;
  movimientoId: string;
}
```

---

## 5. Especificación de API

### Base
- URL: `http://localhost:3000/api/v1`
- Auth: Bearer Token (JWT)
- Método UPDATE: **PATCH** (no PUT)

### Personas

```
GET    /personas                    # Listar (solo activos)
GET    /personas/:id                # Obtener
POST   /personas                    # Crear
PATCH  /personas/:id                # Actualizar
DELETE /personas/:id                # Soft delete
GET    /personas/con-deudas         # Con deudas (incluyendo dados de baja)
```

### Cajas

```
GET    /cajas/grupo/saldo           # Calcula dinámicamente
GET    /cajas/grupo/movimientos     # Con filtros
GET    /cajas/rama/:rama/saldo
GET    /cajas/rama/:rama/movimientos
GET    /cajas/personal/:personaId/saldo
GET    /cajas/personal/:personaId/movimientos
```

### Movimientos

```
GET    /movimientos?concepto=X&tipo=Y
POST   /movimientos
PATCH  /movimientos/:id
DELETE /movimientos/:id
```

---

## 6. Frontend: Constantes y Enums (SIN MAGIC STRINGS)

### shared/enums/index.ts

```typescript
// Rama
export const RAMAS = ['Manada', 'Unidad', 'Caminantes', 'Rovers'] as const;
export type Rama = typeof RAMAS[number];

// Estado Persona
export const ESTADOS_PERSONA = ['activo', 'inactivo'] as const;
export type EstadoPersona = typeof ESTADOS_PERSONA[number];

// Tipo Movimiento
export const TIPOS_MOVIMIENTO = ['ingreso', 'egreso'] as const;
export type TipoMovimiento = typeof TIPOS_MOVIMIENTO[number];

// Medio Pago
export const MEDIOS_PAGO = ['efectivo', 'transferencia'] as const;
export type MedioPago = typeof MEDIOS_PAGO[number];

// Concepto Movimiento
export enum ConceptoMovimiento {
  INSCRIPCION = 'inscripcion',
  CUOTA_GRUPO = 'cuota_grupo',
  EVENTO_VENTA_INGRESO = 'evento_venta_ingreso',
  EVENTO_GRUPO_INGRESO = 'evento_grupo_ingreso',
  GASTO_GENERAL = 'gasto_general',
  // ...
}

// Tipo Caja
export enum TipoCaja {
  GRUPO = 'grupo',
  RAMA_MANADA = 'rama_manada',
  RAMA_UNIDAD = 'rama_unidad',
  RAMA_CAMINANTES = 'rama_caminantes',
  RAMA_ROVERS = 'rama_rovers',
  PERSONAL = 'personal'
}
```

### shared/constants/api.constants.ts

```typescript
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000/api',
  VERSION: 'v1',
  ENDPOINTS: {
    PERSONAS: 'personas',
    CAJAS: 'cajas',
    MOVIMIENTOS: 'movimientos',
    EVENTOS: 'eventos',
    CAMPAMENTOS: 'campamentos',
    INSCRIPCIONES: 'inscripciones'
  }
} as const;
```

---

## 7. Frontend: Patrón Smart/Dumb (Componentes Pequeños)

### Límites de Código

| Tipo | Max Líneas | Responsabilidad |
|------|-----------|-----------------|
| Smart (Container) | 200 | Estado, lógica, orquestación |
| Dumb (Presentación) | 100 | Solo UI, @Input/@Output |
| Form Section | 150 | Secciones de formulario |
| Shared Component | 80 | Botones, cards, utilidades |

### Ejemplo: Protagonistas List

```typescript
// SMART: list.component.ts (max 200 líneas)
@Component({
  selector: 'app-protagonistas-list',
  standalone: true,
  imports: [
    CommonModule,
    ProtagonistasFiltersComponent,  // Dumb
    ProtagonistasTableComponent,    // Dumb
  ],
  template: `
    <app-protagonistas-filters [ramas]="RAMAS" (filtroChange)="onFiltro($event)" />
    @if (loading()) { <app-spinner /> }
    @else if (protagonistas().length === 0) { <app-empty-state /> }
    @else {
      <app-protagonistas-table
        [data]="protagonistas()"
        (select)="onSelect($event)"
      />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProtagonistasListComponent {
  protected readonly RAMAS = RAMAS;

  protagonistas = inject(ProtagonistasStateService).protagonistas;
  loading = inject(ProtagonistasStateService).loading;
  private state = inject(ProtagonistasStateService);

  ngOnInit() {
    this.state.load();
  }

  onFiltro(filtro: FiltroProtagonistas): void {
    this.state.applyFilter(filtro);
  }
}

// DUMB: table.component.ts (max 80 líneas)
@Component({
  selector: 'app-protagonistas-table',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <table mat-table [dataSource]="data">
      <ng-container matColumnDef="nombre">
        <th mat-header-cell *matHeaderCellDef>Nombre</th>
        <td mat-cell *matCellDef="let p">{{ p.nombre }}</td>
      </ng-container>
      <!-- más columnas -->
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"
          (click)="select.emit(row.id)"></tr>
    </table>
  `
})
export class ProtagonistasTableComponent {
  @Input({ required: true }) data!: Protagonista[];
  @Output() select = new EventEmitter<string>();

  readonly displayedColumns = ['nombre', 'rama', 'estado', 'acciones'];
}
```

---

## 8. Frontend: State Management con Signals

```typescript
// modules/personas/services/protagonistas-state.service.ts
@Injectable({ providedIn: 'root' })
export class ProtagonistasStateService {
  private api = inject(ProtagonistasApiService);

  // Estado privado
  private _protagonistas = signal<Protagonista[]>([]);
  private _loading = signal(false);
  private _error = signal<string | null>(null);
  private _selectedId = signal<string | null>(null);

  // Estado público (readonly)
  readonly protagonistas = this._protagonistas.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  // Computed (derivado)
  readonly selected = computed(() => {
    const id = this._selectedId();
    if (!id) return null;
    return this._protagonistas().find(p => p.id === id) ?? null;
  });

  readonly activos = computed(() =>
    this._protagonistas().filter(p => p.estado === 'activo')
  );

  // Acciones
  load(): void {
    this._loading.set(true);
    this._error.set(null);

    this.api.getAll().subscribe({
      next: (data) => {
        this._protagonistas.set(data);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set(err.message);
        this._loading.set(false);
      }
    });
  }

  create(dto: CreateProtagonistaDtoRequest): Observable<Protagonista> {
    this._loading.set(true);
    return this.api.create(dto).pipe(
      tap((nuevo) => {
        this._protagonistas.update((list) => [...list, nuevo]);
        this._loading.set(false);
      }),
      catchError((err) => {
        this._loading.set(false);
        return throwError(() => err);
      })
    );
  }

  select(id: string | null): void {
    this._selectedId.set(id);
  }
}
```

---

## 9. Frontend: TypeScript Strict Mode

### tsconfig.json

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noPropertyAccessFromIndexSignature": true,
    "exactOptionalPropertyTypes": true,
    "forceConsistentCasingInFileNames": true
  },
  "angularCompilerOptions": {
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true
  }
}
```

---

## 10. Validaciones: FormBuilder Reutilizable

```typescript
// shared/forms/form-builders/protagonista-form.builder.ts
@Injectable({ providedIn: 'root' })
export class ProtagonistasFormBuilder {
  private fb = inject(FormBuilder);

  build(): FormGroup {
    return this.fb.group({
      nombre: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        this.safeTextValidator()
      ]],
      rama: ['', [Validators.required, this.ramaValidator()]],
      fechaIngreso: [null, [Validators.required, this.noFutureDateValidator()]],
      fueBonificado: [false]
    });
  }

  private ramaValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      return RAMAS.includes(control.value) ? null : { invalidRama: true };
    };
  }

  private noFutureDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      return new Date(control.value) > new Date() ? { futureDate: true } : null;
    };
  }

  private safeTextValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      return /[<>\"\'&]/.test(control.value) ? { unsafeText: true } : null;
    };
  }
}
```

---

## 11. Testing: Sin `any` - Mocks Tipados

```typescript
// testing/mocks/protagonista.mock.ts
export const mockProtagonista: Readonly<Protagonista> = {
  id: 'prot-001',
  nombre: 'Juan',
  rama: 'Manada',
  estado: 'activo',
  fechaIngreso: new Date('2024-01-15'),
  fueBonificado: false,
  createdAt: new Date(),
  updatedAt: new Date()
};

// testing/mocks/services/protagonistas-api.mock.ts
export class MockProtagonistasApiService {
  getAll(): Observable<Protagonista[]> {
    return of([mockProtagonista]);
  }

  create(dto: CreateProtagonistaDtoRequest): Observable<Protagonista> {
    return of({ ...mockProtagonista, id: 'new-id' });
  }
}
```

---

## 12. Deployment

### Desarrollo Local

**Backend**:
```bash
npm install
npm run start:dev
# Puerto 3000
```

**Frontend**:
```bash
npm install
ng serve
# Puerto 4200
```

**Database**:
```bash
# Connection string: postgresql://<usuario>:<password>@<host-neon>/<db> (ver .env.local; nunca en docs)
npm run typeorm:migration:run
```

---

## 13. Decisiones Confirmadas

| Decisión | Opción | Justificación |
|----------|--------|---------------|
| **Language** | TypeScript strict | Type safety, prevenir bugs en tiempo de compilación |
| **State** | Signals + OnPush | Performance superior, código limpio, sin RxJS complexity |
| **API** | PATCH no PUT | Parcial, más seguro |
| **ORM** | TypeORM + PostgreSQL | Type-safe queries, relaciones, migraciones |
| **Inheritance** | Single Table | DRY, queries uniformes, relaciones simples |
| **Componentes** | Smart/Dumb | Testeable, reusable, pequeño |
| **Enums** | Centralizados | SIN magic strings, autocompletado |
| **Lazy Load** | Standalone routes | Módulos independientes |
| **Testing** | Jest + Typed mocks | Sin `any`, confiable |
| **Validation** | Frontend + Backend | Double check, seguridad |

---

## 14. Próximos Pasos

1. ✅ Crear repositorio Git
2. → Setup backend (NestJS init)
3. → Setup frontend (Angular init)
4. → Entidades y DTOs
5. → Servicios y controllers
6. → Componentes frontend
7. → Tests
8. → Integración

---

*TRD v2.0 - Febrero 2026*
*Arquitectura: Angular v21 + NestJS + PostgreSQL*
*Principios: Tipado, modular, performance, testing*
