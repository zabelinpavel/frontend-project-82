import { describe, it, expect } from '@jest/globals';
import genDiff, { buildDiffLines } from '../index.js';

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

describe('genDiff', () => {
    it('should compare two JSON files', () => {
        const filepath1 = '__tests__/__fixtures__/file1.json';
        const filepath2 = '__tests__/__fixtures__/file2.json';
        const result = genDiff(filepath1, filepath2);

        expect(result).toBeDefined();
        expect(typeof result).toBe('string');
        expect(result).toContain('{');
        expect(result).toContain('}');
    });

    it('should show difference between files', () => {
        const filepath1 = '__tests__/__fixtures__/file1.json';
        const filepath2 = '__tests__/__fixtures__/file2.json';
        const result = genDiff(filepath1, filepath2);

        expect(result).toContain('- follow');
        expect(result).toContain('- proxy');
        expect(result).toContain('+ verbose');
        expect(result).toContain('host');
        expect(result).toContain('timeout');
    });
});
