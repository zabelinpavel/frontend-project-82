import {
 describe, it, expect, 
} from '@jest/globals';
import parseJSON from '../json.js';

describe('parseJSON', () => {
  it('should parse valid JSON file', () => {
    const result = parseJSON('__tests__/__fixtures__/test.json');
    expect(result).toEqual({
      database: {
        host: 'localhost',
        port: 5432,
        name: 'mydb',
      },
      debug: true,
    });
  });

  it('should parse JSON file with different content', () => {
    const result = parseJSON('__tests__/__fixtures__/file1.json');
    expect(result).toEqual({
      host: 'hexlet.io',
      timeout: 50,
      proxy: '123.234.53.22',
      follow: false,
    });
  });

  it('should throw error for invalid JSON', () => {
    expect(() => parseJSON('__tests__/__fixtures__/invalid.json'))
      .toThrow();
  });

  it('should parse JSON file with nested objects', () => {
    const result = parseJSON('__tests__/__fixtures__/file_nested1.json');
    expect(result).toEqual({
      common: {
        setting1: 'Value 1',
        setting2: 200,
        setting3: true,
        setting6: {
          key: 'value',
          doge: {
            wow: '',
          },
        },
      },
      group1: {
        baz: 'bas',
        foo: 'bar',
        nest: {
          key: 'value',
        },
      },
      group2: {
        abc: 12345,
        deep: {
          id: 45,
        },
      },
    });
  });

  it('should parse JSON file with different nested structure', () => {
    const result = parseJSON('__tests__/__fixtures__/file_nested2.json');
    expect(result).toEqual({
      common: {
        follow: false,
        setting1: 'Value 1',
        setting3: null,
        setting4: 'blah blah',
        setting5: {
          key5: 'value5',
        },
        setting6: {
          key: 'value',
          ops: 'vops',
          doge: {
            wow: 'so much',
          },
        },
      },
      group1: {
        foo: 'bar',
        baz: 'bars',
        nest: 'str',
      },
      group3: {
        deep: {
          id: {
            number: 45,
          },
        },
        fee: 100500,
      },
    });
  });

  it('should handle deeply nested values in JSON', () => {
    const result = parseJSON('__tests__/__fixtures__/file_nested1.json');
    expect(result.common.setting6.doge.wow).toBe('');
    expect(result.group1.nest.key).toBe('value');
    expect(result.group2.deep.id).toBe(45);
  });
});
