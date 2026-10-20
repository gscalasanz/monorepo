/**
 * Enums de inscripcion. La definición vive en `@scout/shared/enums` (única para web y api);
 * acá se re-exporta con el nombre histórico del front (adaptador). Los `*_LABELS` son copy
 * de UI y se quedan en web.
 */
import {
  EstadoInscripcion as ESTADO_INSCRIPCION,
  TipoDeuda as TIPO_DEUDA,
  TipoInscripcion as TIPO_INSCRIPCION,
  type EstadoInscripcion,
  type TipoDeuda,
  type TipoInscripcion,
} from '@scout/shared/enums';

export { ESTADO_INSCRIPCION, TIPO_DEUDA, TIPO_INSCRIPCION };
export type { EstadoInscripcion, TipoDeuda, TipoInscripcion };

export const TIPO_INSCRIPCION_LABELS: Readonly<
  Record<TipoInscripcion, string>
> = {
  grupo: 'Grupo',
  scout_argentina: 'Scout Argentina',
};

export const ESTADO_INSCRIPCION_LABELS: Readonly<
  Record<EstadoInscripcion, string>
> = {
  pendiente: 'Pendiente',
  parcial: 'Pago Parcial',
  pagado: 'Pagado',
  bonificado: 'Bonificado',
};

/** Valor de `rama` en `/inscripciones` para filtrar educadores (singular acá). */
export const INSCRIPCIONES_RAMA_EDUCADOR = 'educador';
