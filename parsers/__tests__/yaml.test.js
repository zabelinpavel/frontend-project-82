import {
 describe, it, expect, 
} from '@jest/globals';
import parseYaml from '../yaml.js';

describe('parseYaml', () => {
  it('should parse valid YAML file with .yml extension', () => {
    const result = parseYaml('__tests__/__fixtures__/config1.yml');
    expect(result).toEqual({
      host: 'hexlet.io',
      timeout: 50,
      proxy: '123.234.53.22',
      follow: false,
    });
  });

  it('should parse valid YAML file with .yaml extension', () => {
    const result = parseYaml('__tests__/__fixtures__/test.yaml');
    expect(result).toEqual({
      database: {
        host: 'localhost',
        port: 5432,
        name: 'mydb',
      },
      debug: true,
    });
  });

  it('should parse YAML file from file2 fixture', () => {
    const result = parseYaml('__tests__/__fixtures__/config2.yml');
    expect(result).toEqual({
      timeout: 20,
      verbose: true,
      host: 'hexlet.io',
    });
  });

  it('should throw error for invalid YAML', () => {
    expect(() => parseYaml('__tests__/__fixtures__/invalid.yml'))
      .toThrow();
  });

  it('should parse YAML file with nested objects', () => {
    const result = parseYaml('__tests__/__fixtures__/config_nested1.yml');
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

  it('should parse YAML file with different nested structure', () => {
    const result = parseYaml('__tests__/__fixtures__/config_nested2.yml');
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

  it('should handle deeply nested values in YAML', () => {
    const result = parseYaml('__tests__/__fixtures__/config_nested1.yml');
    expect(result.common.setting6.doge.wow).toBe('');
    expect(result.group1.nest.key).toBe('value');
    expect(result.group2.deep.id).toBe(45);
  });
});
