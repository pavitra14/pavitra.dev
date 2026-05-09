import js from '@eslint/js';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import typescriptEslint from '@typescript-eslint/eslint-plugin';

export default [
  {
    ignores: ['tailwind.config.js', '.next/**', 'node_modules/**', '.contentlayer/**'],
  },
  js.configs.recommended,
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'react/no-unescaped-entities': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'no-unused-vars': 'off',
    },
  },
];
