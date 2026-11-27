/**
 * `@/shared/components/transferencia` — diálogo "Transferir entre Cajas"
 * (`POST /movimientos/transferencia`), usado por Cajas y por la ficha de Personas.
 */
export {
  TransferenciaDialog,
  type TransferenciaDialogProps,
} from './transferencia-dialog';
export {
  buildTransferenciaDto,
  destinoOptions,
  transferenciaPrecheck,
  type TransferenciaOrigen,
} from './transferencia';
