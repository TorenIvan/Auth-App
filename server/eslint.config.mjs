import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

export default defineConfig(
  { ignores: ['node_modules/**', 'build/**', 'dist/**'] },
  js.configs.recommended,
  tseslint.configs.recommended,
  prettierRecommended,
  {
    rules: {
      // Unused `catch (error)` is the convention of this codebase (as in typescript-eslint 6)
      '@typescript-eslint/no-unused-vars': ['error', { caughtErrors: 'none' }],
    },
  }
);
