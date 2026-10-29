import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./src/__tests__/setup.ts'],
    testTimeout: 30000,
    hookTimeout: 60000,
    clearMocks: true,
    env: {
      // The MongoDB binary is fetched once outside the test run; tests never download anything
      MONGOMS_RUNTIME_DOWNLOAD: 'false',
    },
  },
});
