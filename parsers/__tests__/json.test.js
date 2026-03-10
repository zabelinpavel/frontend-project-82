import { describe, it, expect } from '@jest/globals';
import parseJSON from '../json.js';

describe('parseJSON', () => {
    it('should parse valid JSON file', () => {
        const result = parseJSON('__tests__/__fixtures__/test.json');
        expect(result).toEqual({
            database: {
                host: 'localhost',
                port: 5432,
                name: 'mydb'
            },
            debug: true
        });
    });

    it('should parse JSON file with different content', () => {
        const result = parseJSON('__tests__/__fixtures__/file1.json');
        expect(result).toEqual({
            host: 'hexlet.io',
            timeout: 50,
            proxy: '123.234.53.22',
            follow: false
        });
    });

    it('should throw error for invalid JSON', () => {
        expect(() => parseJSON('__tests__/__fixtures__/invalid.json'))
            .toThrow();
    });
});
