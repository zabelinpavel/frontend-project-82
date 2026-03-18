const globals = require('globals');
const js = require('@eslint/js');

module.exports = [
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

      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],
      'object-curly-newline': ['error', { multiline: true, minProperties: 1 }],
      'arrow-parens': ['error', 'always'],
      'no-use-before-define': ['error', { functions: false, classes: true, variables: true }],
      'implicit-arrow-linebreak': ['error', 'beside'],
      'function-paren-newline': ['error', 'multiline'],

      'indent': ['error', 2],
      'no-trailing-spaces': 'error',
      'no-multiple-empty-lines': ['error', { max: 1 }],
    },
    ignores: ['coverage/', 'node_modules/'],
  },
];
