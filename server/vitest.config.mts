import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./src/__tests__/setup.ts'],
    // The TypeScript build also emits the tests into dist
    exclude: [...configDefaults.exclude, 'dist/**'],
    testTimeout: 30000,
    hookTimeout: 60000,
    clearMocks: true,
    env: {
      // The MongoDB binary is fetched once outside the test run (see README); tests never download anything
      MONGOMS_RUNTIME_DOWNLOAD: 'false',
      MONGOMS_VERSION: '8.2.6',
      MONGOMS_PREFER_GLOBAL_PATH: 'true',
    },
  },
});
