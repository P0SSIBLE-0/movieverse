import js from '@eslint/js'
import nextVitals from 'eslint-config-next/core-web-vitals'
import globals from 'globals'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  { ignores: ['.next', 'dev-dist', 'dist', 'next-env.d.ts'] },
  ...nextVitals,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])
