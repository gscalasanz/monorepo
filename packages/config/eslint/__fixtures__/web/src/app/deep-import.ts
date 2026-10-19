// Caso inválido: se importa un internal de un feature (no su barrel) → entry-point.
import { widget } from '../features/a/components/widget';

export const page = widget;
