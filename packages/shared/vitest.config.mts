import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'test/**/*.test.ts'],
    // UTC a propósito (igual que web): los bugs de zona horaria aparecen en CI y en Render.
    env: { TZ: 'UTC' },
  },
});
