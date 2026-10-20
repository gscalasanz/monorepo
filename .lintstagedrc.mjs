/**
 * Gate de pre-commit (palanca L2 de docs/flujo-confiable.md): si el commit toca TS, corre el
 * typecheck y el lint de TODO el workspace (turbo cachea lo que no cambió). Función sin
 * argumentos → lint-staged no agrega los paths al comando.
 */
const config = {
  '*.{ts,tsx,mts,cts}': () => ['pnpm -w typecheck', 'pnpm -w lint'],
};

export default config;
