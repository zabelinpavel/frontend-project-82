import globals from 'globals';
import js from '@eslint/js';

export default [
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                ...globals.node
            }
        },
        plugins: {
            js
        },
        rules: {
            ...js.configs.recommended.rules,
            indent: ['error', 4],
            quotes: ['error', 'single'],
            semi: ['error', 'always']
        },
        ignores: ['coverage/', 'node_modules/']
    }
];
