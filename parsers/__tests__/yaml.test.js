import { describe, it, expect } from '@jest/globals';
import parseYaml from '../yaml.js';

describe('parseYaml', () => {
    it('should parse valid YAML file with .yml extension', () => {
        const result = parseYaml('__tests__/__fixtures__/config1.yml');
        expect(result).toEqual({
            host: 'hexlet.io',
            timeout: 50,
            proxy: '123.234.53.22',
            follow: false
        });
    });

    it('should parse valid YAML file with .yaml extension', () => {
        const result = parseYaml('__tests__/__fixtures__/test.yaml');
        expect(result).toEqual({
            database: {
                host: 'localhost',
                port: 5432,
                name: 'mydb'
            },
            debug: true
        });
    });

    it('should parse YAML file from file2 fixture', () => {
        const result = parseYaml('__tests__/__fixtures__/config2.yml');
        expect(result).toEqual({
            timeout: 20,
            verbose: true,
            host: 'hexlet.io'
        });
    });

    it('should throw error for invalid YAML', () => {
        expect(() => parseYaml('__tests__/__fixtures__/invalid.yml'))
            .toThrow();
    });
});
