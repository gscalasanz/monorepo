/** Gate de pre-commit (palanca L2 de mi-tienda/flujo-confiable.md). */
const config = {
  '*.{ts,tsx}': () => ['pnpm typecheck', 'pnpm lint'],
};

export default config;
