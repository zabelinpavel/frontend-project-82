import globals from 'globals';
import js from '@eslint/js';

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      js,
    },
    rules: {
      ...js.configs.recommended.rules,
      indent: 'off',
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],
      'object-curly-newline': ['error', { multiline: true, consistent: true }],
      'arrow-parens': ['error', 'always'],
      'prefer-template': 'off',
      'implicit-arrow-linebreak': 'off',
      'no-use-before-define': 'off',
      'fp/no-let': 'off',
      'fp/no-mutation': 'off',
      'fp/no-mutating-methods': 'off',
      'fp/no-unused-expression': 'off',
      'no-console': 'off',
    },
    ignores: ['coverage/', 'node_modules/'],
  },
];
