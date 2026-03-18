import globals from 'globals';

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
    rules: {
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],
      'object-curly-newline': ['error', {
        multiline: true, minProperties: 1,
      }],
      'arrow-parens': ['error', 'always'],
      'implicit-arrow-linebreak': ['error', 'beside'],
      'function-paren-newline': ['error', 'multiline'],

      'indent': ['error', 2],
      'no-trailing-spaces': 'error',
      'no-multiple-empty-lines': ['error', {
        max: 1,
      }],
      'no-extra-semi': 'error',

      'no-use-before-define': ['error', {
        functions: true, classes: true, variables: true,
      }],
    },
    ignores: ['coverage/', 'node_modules/'],
  },
];
