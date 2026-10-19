import type { CajaType } from '@/shared/domain/caja/enums';
import type { Rama } from '@/shared/domain/persona';

/** `POST /cajas` */
export interface CreateCajaDto {
  readonly tipo: CajaType;
  readonly nombre?: string;
  readonly propietarioId?: string;
}

/** Valor de `rama` en `GET /cajas` para filtrar cuentas de educadores (en plural acá). */
export const CAJAS_RAMA_EDUCADORES = 'educadores';

/** Query de `GET /cajas` (`rama` solo aplica con `tipo=personal`). */
export interface CajasQuery {
  readonly tipo?: CajaType;
  readonly rama?: Rama | typeof CAJAS_RAMA_EDUCADORES;
}
