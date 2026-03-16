import { describe, it, expect } from '@jest/globals';
import plain from '../plain.js';

describe('plain formatter', () => {
    it('should return empty object for empty tree', () => {
        const result = plain([]);
        expect(result).toBe('{}');
    });

    it('should format simple added node exactly', () => {
        const tree = [
            { key: 'follow', status: 'added', value: false }
        ];
        const result = plain(tree);
        const expected = `{
  + follow: false
}`;
        expect(result).toBe(expected);
    });

    it('should format simple removed node exactly', () => {
        const tree = [
            { key: 'proxy', status: 'removed', value: '123.234.53.22' }
        ];
        const result = plain(tree);
        const expected = `{
  - proxy: 123.234.53.22
}`;
        expect(result).toBe(expected);
    });

    it('should format changed primitive value exactly', () => {
        const tree = [
            { key: 'timeout', status: 'changed', oldValue: 50, newValue: 20 }
        ];
        const result = plain(tree);
        const expected = `{
  - timeout: 50
  + timeout: 20
}`;
        expect(result).toBe(expected);
    });

    it('should format unchanged node exactly', () => {
        const tree = [
            { key: 'setting1', status: 'unchanged', value: 'Value 1' }
        ];
        const result = plain(tree);
        const expected = `{
  setting1: Value 1
}`;
        expect(result).toBe(expected);
    });

    it('should format changed node with nested object', () => {
        const tree = [
            {
                key: 'outer',
                status: 'changed',
                children: [
                    { key: 'inner', status: 'changed', oldValue: 'value1', newValue: 'value2' }
                ]
            }
        ];
        const result = plain(tree);

        expect(result).toContain('outer: {');
        expect(result).toContain('- inner: value1');
        expect(result).toContain('+ inner: value2');
    });

    it('should format multiple nodes', () => {
        const tree = [
            { key: 'a', status: 'unchanged', value: '1' },
            { key: 'b', status: 'added', value: '2' },
            { key: 'c', status: 'removed', value: '3' }
        ];
        const result = plain(tree);

        expect(result).toContain('a: 1');
        expect(result).toContain('+ b: 2');
        expect(result).toContain('- c: 3');
    });

    it('should format deeply nested objects', () => {
        const tree = [
            {
                key: 'setting6',
                status: 'changed',
                children: [
                    {
                        key: 'doge',
                        status: 'changed',
                        children: [
                            { key: 'wow', status: 'changed', oldValue: '', newValue: 'so much' }
                        ]
                    }
                ]
            }
        ];
        const result = plain(tree);

        expect(result).toContain('setting6: {');
        expect(result).toContain('doge: {');
        expect(result).toContain('- wow:');
        expect(result).toContain('+ wow: so much');
    });

    it('should format null values', () => {
        const tree = [
            { key: 'setting3', status: 'changed', oldValue: true, newValue: null }
        ];
        const result = plain(tree);

        expect(result).toContain('- setting3: true');
        expect(result).toContain('+ setting3: null');
    });

    it('should format object values', () => {
        const tree = [
            {
                key: 'setting5',
                status: 'added',
                value: { key5: 'value5' }
            }
        ];
        const result = plain(tree);

        expect(result).toContain('+ setting5: {');
        expect(result).toContain('key5: value5');
    });

    it('should format mixed changes in nested structure', () => {
        const tree = [
            {
                key: 'common',
                status: 'changed',
                children: [
                    { key: 'setting1', status: 'unchanged', value: 'Value 1' },
                    { key: 'setting2', status: 'removed', value: 200 },
                    { key: 'follow', status: 'added', value: false }
                ]
            }
        ];
        const result = plain(tree);

        expect(result).toContain('common: {');
        expect(result).toContain('setting1: Value 1');
        expect(result).toContain('- setting2: 200');
        expect(result).toContain('+ follow: false');
    });

    it('should format removed nested object', () => {
        const tree = [
            {
                key: 'nest',
                status: 'removed',
                value: { key: 'value' }
            }
        ];
        const result = plain(tree);

        expect(result).toContain('- nest: {');
        expect(result).toContain('key: value');
    });

    it('should format added nested object', () => {
        const tree = [
            {
                key: 'nest',
                status: 'added',
                value: 'str'
            }
        ];
        const result = plain(tree);

        expect(result).toContain('+ nest: str');
    });

    it('should format complex nested structure from real files', () => {
        const tree = [
            {
                key: 'group1',
                status: 'changed',
                children: [
                    { key: 'baz', status: 'changed', oldValue: 'bas', newValue: 'bars' },
                    { key: 'foo', status: 'unchanged', value: 'bar' },
                    { key: 'nest', status: 'changed', oldValue: { key: 'value' }, newValue: 'str' }
                ]
            }
        ];
        const result = plain(tree);

        expect(result).toContain('group1: {');
        expect(result).toContain('- baz: bas');
        expect(result).toContain('+ baz: bars');
        expect(result).toContain('foo: bar');
    });

    it('should format full diff tree from real files (snapshot)', () => {
        const tree = [
            {
                key: 'common',
                status: 'changed',
                children: [
                    { key: 'follow', status: 'added', value: false },
                    { key: 'setting1', status: 'unchanged', value: 'Value 1' },
                    { key: 'setting2', status: 'removed', value: 200 },
                    { key: 'setting3', status: 'changed', oldValue: true, newValue: null },
                    { key: 'setting4', status: 'added', value: 'blah blah' },
                    {
                        key: 'setting5',
                        status: 'added',
                        value: { key5: 'value5' }
                    },
                    {
                        key: 'setting6',
                        status: 'changed',
                        children: [
                            {
                                key: 'doge',
                                status: 'changed',
                                children: [
                                    { key: 'wow', status: 'changed', oldValue: '', newValue: 'so much' }
                                ]
                            },
                            { key: 'key', status: 'unchanged', value: 'value' },
                            { key: 'ops', status: 'added', value: 'vops' }
                        ]
                    }
                ]
            },
            {
                key: 'group1',
                status: 'changed',
                children: [
                    { key: 'baz', status: 'changed', oldValue: 'bas', newValue: 'bars' },
                    { key: 'foo', status: 'unchanged', value: 'bar' },
                    { key: 'nest', status: 'changed', oldValue: { key: 'value' }, newValue: 'str' }
                ]
            },
            { key: 'group2', status: 'removed', value: { abc: 12345, deep: { id: 45 } } },
            {
                key: 'group3',
                status: 'added',
                value: { deep: { id: { number: 45 } }, fee: 100500 }
            }
        ];
        const result = plain(tree);

        expect(result).toMatchSnapshot();
    });
});
