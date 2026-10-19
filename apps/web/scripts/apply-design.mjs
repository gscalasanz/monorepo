// Aplica una dirección estética: copia sus tokens, fuentes y DESIGN.md a los lugares
// que consume la app. Uso: `pnpm design:apply <nombre>` (ver design-directions/).
import { copyFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const DIRECTIONS_DIR = 'design-directions';
const TOKENS_TARGET = 'src/shared/styles/tokens.css';
const DESIGN_TARGET = 'docs/DESIGN.md';
const FONTS_TARGET = 'src/shared/styles/fonts.ts';

const name = process.argv[2];
const available = readdirSync(DIRECTIONS_DIR).filter((entry) =>
  existsSync(join(DIRECTIONS_DIR, entry, 'tokens.css')),
);

if (!name || !available.includes(name)) {
  console.error(`Uso: pnpm design:apply <${available.join('|')}>`);
  process.exit(1);
}

copyFileSync(join(DIRECTIONS_DIR, name, 'tokens.css'), TOKENS_TARGET);
copyFileSync(join(DIRECTIONS_DIR, name, 'DESIGN.md'), DESIGN_TARGET);
copyFileSync(join(DIRECTIONS_DIR, name, 'fonts.ts'), FONTS_TARGET);
console.log(`Dirección "${name}" aplicada → ${TOKENS_TARGET} + ${DESIGN_TARGET} + ${FONTS_TARGET}`);
