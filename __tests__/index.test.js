import { describe, it, expect } from '@jest/globals';
import generateDiff, { parseFile, buildDiffLines } from '../index.js';

describe('parseFile', () => {
    it('should read and parse JSON file', () => {
        const filePath = '__tests__/__fixtures__/file1.json';
        const result = parseFile(filePath);

        expect(result).toBeDefined();
        expect(typeof result).toBe('object');
    });

    it('should return correct file content', () => {
        const filePath = '__tests__/__fixtures__/file1.json';
        const result = parseFile(filePath);

        expect(result).toEqual({
            host: 'hexlet.io',
            timeout: 50,
            proxy: '123.234.53.22',
            follow: false,
        });
    });
});

describe('buildDiffLines', () => {
    it('should show removed keys', () => {
        const data1 = { key: 'value' };
        const data2 = {};
        const result = buildDiffLines(data1, data2);

        expect(result).toContain('- key');
    });

    it('should show added keys', () => {
        const data1 = {};
        const data2 = { key: 'value' };
        const result = buildDiffLines(data1, data2);

        expect(result).toContain('+ key');
    });

    it('should show unchanged keys', () => {
        const data1 = { key: 'value' };
        const data2 = { key: 'value' };
        const result = buildDiffLines(data1, data2);

        expect(result).toContain('  key');
    });

    it('should show changed values', () => {
        const data1 = { key: 'old' };
        const data2 = { key: 'new' };
        const result = buildDiffLines(data1, data2);

        expect(result).toContain('- key');
        expect(result).toContain('+ key');
    });
});

describe('generateDiff', () => {
    it('should compare two JSON files', () => {
        const filepath1 = '__tests__/__fixtures__/file1.json';
        const filepath2 = '__tests__/__fixtures__/file2.json';
        const result = generateDiff(filepath1, filepath2);

        expect(result).toBeDefined();
        expect(typeof result).toBe('string');
        expect(result).toContain('{');
        expect(result).toContain('}');
    });

    it('should show difference between files', () => {
        const filepath1 = '__tests__/__fixtures__/file1.json';
        const filepath2 = '__tests__/__fixtures__/file2.json';
        const result = generateDiff(filepath1, filepath2);

        expect(result).toContain('- follow');
        expect(result).toContain('- proxy');
        expect(result).toContain('+ verbose');
        expect(result).toContain('host');
        expect(result).toContain('timeout');
    });
});
