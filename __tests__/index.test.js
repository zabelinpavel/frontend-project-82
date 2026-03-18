import {
  describe, it, expect,
} from '@jest/globals';
import genDiff, {
  buildDiffTree,
} from '../index.js';

describe('buildDiffTree', () => {
  it('should show removed keys', () => {
    const data1 = {
      key: 'value',
    };
    const data2 = {};
    const result = buildDiffTree(data1, data2);

    expect(result).toEqual([
      {
        key: 'key', status: 'removed', value: 'value',
      },
    ]);
  });

  it('should show added keys', () => {
    const data1 = {};
    const data2 = {
      key: 'value',
    };
    const result = buildDiffTree(data1, data2);

    expect(result).toEqual([
      {
        key: 'key', status: 'added', value: 'value',
      },
    ]);
  });

  it('should show unchanged keys', () => {
    const data1 = {
      key: 'value',
    };
    const data2 = {
      key: 'value',
    };
    const result = buildDiffTree(data1, data2);

    expect(result).toEqual([
      {
        key: 'key', status: 'unchanged', value: 'value',
      },
    ]);
  });

  it('should show changed values', () => {
    const data1 = {
      key: 'old',
    };
    const data2 = {
      key: 'new',
    };
    const result = buildDiffTree(data1, data2);

    expect(result).toEqual([
      {
        key: 'key',
        status: 'changed',
        oldValue: 'old',
        newValue: 'new',
      },
    ]);
  });

  it('should handle nested objects', () => {
    const data1 = {
      outer: {
        inner: 'value1',
      },
    };
    const data2 = {
      outer: {
        inner: 'value2',
      },
    };
    const result = buildDiffTree(data1, data2);

    expect(result).toEqual([
      {
        key: 'outer',
        status: 'changed',
        children: [
          {
            key: 'inner',
            status: 'changed',
            oldValue: 'value1',
            newValue: 'value2',
          },
        ],
      },
    ]);
  });

  it('should handle mixed changes', () => {
    const data1 = {
      a: '1', b: '2', c: '3',
    };
    const data2 = {
      a: '1', b: 'changed', d: '4',
    };
    const result = buildDiffTree(data1, data2);

    expect(result).toEqual([
      {
        key: 'a',
        status: 'unchanged',
        value: '1',
      },
      {
        key: 'b',
        status: 'changed',
        oldValue: '2',
        newValue: 'changed',
      },
      {
        key: 'c',
        status: 'removed',
        value: '3',
      },
      {
        key: 'd',
        status: 'added',
        value: '4',
      },
    ]);
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

  it('should handle nested objects in JSON files', () => {
    const filepath1 = '__tests__/__fixtures__/file_nested1.json';
    const filepath2 = '__tests__/__fixtures__/file_nested2.json';
    const result = genDiff(filepath1, filepath2);

    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
    expect(result).toContain('common');
    expect(result).toContain('group1');
  });

  it('should detect removed nested keys', () => {
    const filepath1 = '__tests__/__fixtures__/file_nested1.json';
    const filepath2 = '__tests__/__fixtures__/file_nested2.json';
    const result = genDiff(filepath1, filepath2);

    expect(result).toContain('- group2');
  });

  it('should detect added nested keys', () => {
    const filepath1 = '__tests__/__fixtures__/file_nested1.json';
    const filepath2 = '__tests__/__fixtures__/file_nested2.json';
    const result = genDiff(filepath1, filepath2);

    expect(result).toContain('+ group3');
  });

  it('should detect changed values in nested objects', () => {
    const filepath1 = '__tests__/__fixtures__/file_nested1.json';
    const filepath2 = '__tests__/__fixtures__/file_nested2.json';
    const result = genDiff(filepath1, filepath2);

    expect(result).toContain('setting6');
    expect(result).toContain('doge');
  });

  it('should handle nested objects in YAML files', () => {
    const filepath1 = '__tests__/__fixtures__/config_nested1.yml';
    const filepath2 = '__tests__/__fixtures__/config_nested2.yml';
    const result = genDiff(filepath1, filepath2);

    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
    expect(result).toContain('common');
    expect(result).toContain('group1');
  });

  it('should detect removed nested keys in YAML', () => {
    const filepath1 = '__tests__/__fixtures__/config_nested1.yml';
    const filepath2 = '__tests__/__fixtures__/config_nested2.yml';
    const result = genDiff(filepath1, filepath2);

    expect(result).toContain('- group2');
  });

  it('should detect added nested keys in YAML', () => {
    const filepath1 = '__tests__/__fixtures__/config_nested1.yml';
    const filepath2 = '__tests__/__fixtures__/config_nested2.yml';
    const result = genDiff(filepath1, filepath2);

    expect(result).toContain('+ group3');
  });

  it('should handle deeply nested objects with multiple levels', () => {
    const filepath1 = '__tests__/__fixtures__/file_nested1.json';
    const filepath2 = '__tests__/__fixtures__/file_nested2.json';
    const result = genDiff(filepath1, filepath2);

    expect(result).toContain('setting5');
    expect(result).toContain('key5');
    expect(result).toContain('ops');
  });

  it('should detect changed nested primitive values', () => {
    const filepath1 = '__tests__/__fixtures__/file_nested1.json';
    const filepath2 = '__tests__/__fixtures__/file_nested2.json';
    const result = genDiff(filepath1, filepath2);

    expect(result).toContain('baz');
    expect(result).toContain('nest');
  });

  it('should detect null values in nested objects', () => {
    const filepath1 = '__tests__/__fixtures__/file_nested1.json';
    const filepath2 = '__tests__/__fixtures__/file_nested2.json';
    const result = genDiff(filepath1, filepath2);

    expect(result).toContain('setting3');
  });
});
