import { describe, it, expect } from '@jest/globals';
import genDiff from '../../index.js';
import json, { formatValue, isObject, formatNode } from '../json.js';

describe('json formatter helper functions', () => {
    describe('isObject', () => {
        it('should return true for objects', () => {
            expect(isObject({})).toBe(true);
            expect(isObject({ key: 'value' })).toBe(true);
            expect(isObject([])).toBe(true);
        });

        it('should return false for null', () => {
            expect(isObject(null)).toBe(false);
        });

        it('should return false for primitives', () => {
            expect(isObject('string')).toBe(false);
            expect(isObject(123)).toBe(false);
            expect(isObject(true)).toBe(false);
            expect(isObject(undefined)).toBe(false);
        });
    });

    describe('formatValue', () => {
        it('should format null', () => {
            expect(formatValue(null, 0)).toBe('null');
        });

        it('should format booleans', () => {
            expect(formatValue(true, 0)).toBe('true');
            expect(formatValue(false, 0)).toBe('false');
        });

        it('should format numbers', () => {
            expect(formatValue(42, 0)).toBe('42');
            expect(formatValue(0, 0)).toBe('0');
            expect(formatValue(-10, 0)).toBe('-10');
            expect(formatValue(3.14, 0)).toBe('3.14');
        });

        it('should format strings with double quotes', () => {
            expect(formatValue('hello', 0)).toBe('"hello"');
            expect(formatValue('', 0)).toBe('""');
        });

        it('should format empty arrays', () => {
            expect(formatValue([], 0)).toBe('[]');
        });

        it('should format arrays with values', () => {
            const result = formatValue([1, 2, 3], 0);
            expect(result).toContain('[');
            expect(result).toContain('1');
            expect(result).toContain('2');
            expect(result).toContain('3');
            expect(result).toContain(']');
        });

        it('should format empty objects', () => {
            expect(formatValue({}, 0)).toBe('{}');
        });

        it('should format objects with values', () => {
            const result = formatValue({ key: 'value' }, 0);
            expect(result).toContain('{');
            expect(result).toContain('"key": "value"');
            expect(result).toContain('}');
        });

        it('should handle nested objects', () => {
            const result = formatValue({ outer: { inner: 'value' } }, 0);
            expect(result).toContain('outer');
            expect(result).toContain('inner');
            expect(result).toContain('value');
        });
    });

    describe('formatNode', () => {
        it('should format unchanged node', () => {
            const node = { key: 'key', status: 'unchanged', value: 'value' };
            const result = formatNode(node, 2);

            expect(result).toContain('"key": "key"');
            expect(result).toContain('"status": "unchanged"');
            expect(result).toContain('"value": "value"');
        });

        it('should format added node', () => {
            const node = { key: 'key', status: 'added', value: 'value' };
            const result = formatNode(node, 2);

            expect(result).toContain('"key": "key"');
            expect(result).toContain('"status": "added"');
            expect(result).toContain('"value": "value"');
        });

        it('should format removed node', () => {
            const node = { key: 'key', status: 'removed', value: 'value' };
            const result = formatNode(node, 2);

            expect(result).toContain('"key": "key"');
            expect(result).toContain('"status": "removed"');
            expect(result).toContain('"value": "value"');
        });

        it('should format changed node with oldValue and newValue', () => {
            const node = { key: 'key', status: 'changed', oldValue: 'old', newValue: 'new' };
            const result = formatNode(node, 2);

            expect(result).toContain('"key": "key"');
            expect(result).toContain('"status": "changed"');
            expect(result).toContain('"oldValue": "old"');
            expect(result).toContain('"newValue": "new"');
        });

        it('should format node with children', () => {
            const node = {
                key: 'parent',
                status: 'changed',
                children: [
                    { key: 'child', status: 'added', value: 'value' }
                ]
            };
            const result = formatNode(node, 2);

            expect(result).toContain('"key": "parent"');
            expect(result).toContain('"children": [');
            expect(result).toContain('"child"');
        });

        it('should format node with number value', () => {
            const node = { key: 'key', status: 'unchanged', value: 42 };
            const result = formatNode(node, 2);

            expect(result).toContain('"value": 42');
        });

        it('should format node with boolean value', () => {
            const node = { key: 'key', status: 'added', value: true };
            const result = formatNode(node, 2);

            expect(result).toContain('"value": true');
        });

        it('should format node with null value', () => {
            const node = { key: 'key', status: 'removed', value: null };
            const result = formatNode(node, 2);

            expect(result).toContain('"value": null');
        });
    });
});

describe('json formatter', () => {
    it('should format diff tree as JSON', () => {
        const tree = [
            { key: 'key1', status: 'unchanged', value: 'value1' },
            { key: 'key2', status: 'added', value: 'value2' },
            { key: 'key3', status: 'removed', value: 'value3' },
            { key: 'key4', status: 'changed', oldValue: 'old', newValue: 'new' }
        ];

        const result = json(tree);
        const parsed = JSON.parse(result);

        expect(parsed).toHaveLength(4);
        expect(parsed[0]).toEqual({ key: 'key1', status: 'unchanged', value: 'value1' });
        expect(parsed[1]).toEqual({ key: 'key2', status: 'added', value: 'value2' });
        expect(parsed[2]).toEqual({ key: 'key3', status: 'removed', value: 'value3' });
        expect(parsed[3]).toEqual({ key: 'key4', status: 'changed', oldValue: 'old', newValue: 'new' });
    });

    it('should format empty tree', () => {
        const result = json([]);
        const parsed = JSON.parse(result);

        expect(parsed).toEqual([]);
    });

    it('should format nested changes', () => {
        const tree = [
            {
                key: 'outer',
                status: 'changed',
                children: [
                    {
                        key: 'inner',
                        status: 'changed',
                        children: [
                            { key: 'deep', status: 'changed', oldValue: 'v1', newValue: 'v2' }
                        ]
                    }
                ]
            }
        ];

        const result = json(tree);
        const parsed = JSON.parse(result);

        expect(parsed).toHaveLength(1);
        expect(parsed[0].key).toBe('outer');
        expect(parsed[0].children).toHaveLength(1);
        expect(parsed[0].children[0].children[0]).toEqual({
            key: 'deep',
            status: 'changed',
            oldValue: 'v1',
            newValue: 'v2'
        });
    });

    it('should preserve value types', () => {
        const tree = [
            { key: 'string', status: 'added', value: 'text' },
            { key: 'number', status: 'added', value: 42 },
            { key: 'boolean', status: 'added', value: true },
            { key: 'null', status: 'added', value: null },
            { key: 'object', status: 'added', value: { nested: 'value' } }
        ];

        const result = json(tree);
        const parsed = JSON.parse(result);

        expect(parsed[0].value).toBe('text');
        expect(parsed[1].value).toBe(42);
        expect(parsed[2].value).toBe(true);
        expect(parsed[3].value).toBe(null);
        expect(parsed[4].value).toEqual({ nested: 'value' });
    });

    it('should format diff from real files', () => {
        const filepath1 = '__tests__/__fixtures__/file1.json';
        const filepath2 = '__tests__/__fixtures__/file2.json';
        const result = genDiff(filepath1, filepath2, 'json');
        const parsed = JSON.parse(result);

        expect(Array.isArray(parsed)).toBe(true);
        expect(parsed.length).toBeGreaterThan(0);

        const removedKeys = parsed
            .filter(node => node.status === 'removed')
            .map(node => node.key);

        const addedKeys = parsed
            .filter(node => node.status === 'added')
            .map(node => node.key);

        expect(removedKeys).toContain('follow');
        expect(removedKeys).toContain('proxy');
        expect(addedKeys).toContain('verbose');
    });

    it('should format nested file changes', () => {
        const filepath1 = '__tests__/__fixtures__/config_nested1.yml';
        const filepath2 = '__tests__/__fixtures__/config_nested2.yml';
        const result = genDiff(filepath1, filepath2, 'json');
        const parsed = JSON.parse(result);

        expect(Array.isArray(parsed)).toBe(true);

        const commonNode = parsed.find(node => node.key === 'common');
        expect(commonNode).toBeDefined();
        expect(commonNode.status).toBe('changed');
        expect(commonNode.children).toBeDefined();
        expect(Array.isArray(commonNode.children)).toBe(true);
    });

    it('should produce valid JSON string', () => {
        const tree = [
            { key: 'test', status: 'added', value: 'value' }
        ];

        const result = json(tree);

        expect(typeof result).toBe('string');
        expect(() => JSON.parse(result)).not.toThrow();
    });

    it('should use pretty printing with 2 spaces', () => {
        const tree = [
            { key: 'key1', status: 'added', value: 'value1' },
            { key: 'key2', status: 'removed', value: 'value2' }
        ];

        const result = json(tree);

        expect(result).toContain('  ');
        expect(result.split('\n').length).toBeGreaterThan(2);
    });
});
