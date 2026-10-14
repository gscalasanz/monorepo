/**
 * Copy de los componentes financieros compartidos (campamentos y eventos).
 * Textos EXACTOS de Angular: `movimiento-card`, `gasto-campamento-form`,
 * `ingreso-form` y el confirm de pago de reembolso.
 */
export const FINANZAS_COPY = {
  card: {
    sinDescripcion: 'Sin descripción',
    marcarComoPagado: 'Marcar como pagado',
    eliminar: 'Eliminar movimiento',
    comprobanteEntregado: 'Comprobante entregado',
  },
  filters: {
    ariaLabel: 'Filtrar movimientos',
  },
  reembolso: {
    title: 'Confirmar pago de reembolso',
    message: '¿Confirmás que este gasto fue reembolsado?',
    confirmText: 'Pagar',
    cancelText: 'Cancelar',
    monto: 'Monto',
    descripcion: 'Descripción',
    responsable: 'Responsable',
    sinDescripcion: 'Sin descripción',
    desconocido: 'Desconocido',
  },
  form: {
    monto: 'Monto',
    montoRequerido: 'El monto es requerido',
    montoPositivo: 'Debe ser un número positivo',
    fecha: 'Fecha',
    fechaRequerida: 'La fecha es requerida',
    responsable: 'Responsable',
    responsablePlaceholder: 'Seleccionar responsable',
    responsableRequerido: 'Seleccione un responsable',
    descripcion: 'Descripción',
    descripcionRequerida: 'La descripción es requerida',
    descripcionMax: 'Máximo 500 caracteres',
    medioPago: 'Medio de Pago',
    medioPagoPlaceholder: 'Seleccionar medio',
    medioPagoRequerido: 'Seleccione un medio de pago',
    estadoPago: 'Estado de Pago',
    estadoPagoPlaceholder: 'Seleccionar estado',
    estadoPagoRequerido: 'Seleccione un estado',
    cancelar: 'Cancelar',
  },
  gasto: {
    title: 'Registrar Gasto',
    submit: 'Registrar Gasto',
    saving: 'Guardando gasto...',
    descripcionPlaceholder: 'Ej: Compra de alimentos, transporte, etc.',
    reembolsoBanner:
      'Este gasto no descuenta del saldo de la caja. Se registra como pendiente de reembolso para la persona seleccionada.',
    personaAReembolsar: 'Persona a Reembolsar',
    personaAReembolsarPlaceholder: 'Seleccionar persona que adelantó el dinero',
    personaAReembolsarRequerida: 'Seleccione la persona que adelantó el dinero',
  },
  ingreso: {
    title: 'Registrar Ingreso',
    submit: 'Registrar Ingreso',
    descripcionPlaceholder: 'Ej: Venta de rifas, cuotas, etc.',
  },
} as const;

/** Largo máximo de la descripción (`Validators.maxLength(500)`). */
export const DESCRIPCION_MAX_LENGTH = 500;

/** Decimales admitidos en el monto (`decimalValidator(2)`). */
export const MONTO_MAX_DECIMALS = 2;
