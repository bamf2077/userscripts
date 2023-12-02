/**
 * ESLint Configuration
 * https://zh-hans.eslint.org/docs/latest/use/configure/configuration-files-new
 */

import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import globals from 'globals'

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ['**/*.{js,mjs,ts,mts}'],
    ignores: ['dist/**/*'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.jquery,
        ...globals.greasemonkey,
      },
    },
    ...js.configs.recommended,
    ...eslintConfigPrettier,
  },
]
