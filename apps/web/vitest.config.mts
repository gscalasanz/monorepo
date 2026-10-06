import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    // TZ ≠ BsAs a propósito: si alguna lógica de fechas depende de la zona local
    // (en vez de anclarse a America/Argentina/Buenos_Aires) los tests lo detectan.
    env: { TZ: 'UTC', NEXT_PUBLIC_API_URL: 'http://localhost:3001/api/v1' },
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.test.{ts,tsx}', 'src/**/testing/**', 'src/shared/components/reui/**'],
    },
  },
});
