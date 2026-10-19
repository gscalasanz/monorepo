// Caso inválido: un feature importa de OTRO feature (su barrel) → element-types.
import { thing } from '../b';

export const broken = thing;
