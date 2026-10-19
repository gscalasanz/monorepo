/** Bodies de los endpoints de personas (`personas/dtos`). */
import type {
  CargoEducador,
  EstadoPersona,
  PersonaType,
  Rama,
} from '@/shared/domain/persona/enums';

/** `POST /personas/protagonistas` */
export interface CreateProtagonistaDto {
  readonly nombre: string;
  readonly rama: Rama;
  readonly partidaNacimiento?: boolean;
  readonly dni?: boolean;
  readonly dniPadres?: boolean;
  readonly carnetObraSocial?: boolean;
}

/** `POST /personas/educadores` (email + password van juntos o ninguno). */
export interface CreateEducadorDto {
  readonly nombre: string;
  readonly rama?: Rama;
  readonly cargo: CargoEducador;
  readonly email?: string;
  readonly password?: string;
}

/** `POST /personas/externas` */
export interface CreatePersonaExternaDto {
  readonly nombre: string;
  readonly contacto?: string;
  readonly notas?: string;
}

/** `PATCH /personas/:id` */
export interface UpdatePersonaDto {
  readonly nombre?: string;
  readonly estado?: EstadoPersona;
  readonly rama?: Rama;
  readonly cargo?: CargoEducador;
  readonly contacto?: string;
  readonly notas?: string;
  readonly partidaNacimiento?: boolean;
  readonly dni?: boolean;
  readonly dniPadres?: boolean;
  readonly carnetObraSocial?: boolean;
}

/**
 * Query de `GET /personas`. Ojo: el backend convierte `soloActivos=false` en
 * `true` (implicit conversion de `Boolean("false")`): para traer todos, omitirlo.
 */
export interface PersonasQuery {
  readonly tipo?: PersonaType;
  readonly soloActivos?: true;
}
