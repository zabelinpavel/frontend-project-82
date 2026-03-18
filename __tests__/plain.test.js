import {
  describe, it, expect,
} from '@jest/globals';
import genDiff from '../index.js';
import plain, {
  formatValue, isObject,
} from '../formatters/plain.js';

describe('plain formatter helper functions', () => {
  describe('isObject', () => {
    it('should return true for objects', () => {
      expect(isObject({})).toBe(true);
      expect(isObject({
        key: 'value',
      })).toBe(true);
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
    it('should wrap strings in quotes', () => {
      expect(formatValue('hello')).toBe('\'hello\'');
      expect(formatValue('')).toBe('\'\'');
    });

    it('should return string representation for numbers', () => {
      expect(formatValue(42)).toBe('42');
      expect(formatValue(0)).toBe('0');
    });

    it('should return string representation for booleans', () => {
      expect(formatValue(true)).toBe('true');
      expect(formatValue(false)).toBe('false');
    });

    it('should return complex value for objects', () => {
      expect(formatValue({})).toBe('[complex value]');
      expect(formatValue({
        key: 'value',
      })).toBe('[complex value]');
      expect(formatValue([])).toBe('[complex value]');
    });

    it('should return complex value for null', () => {
      expect(formatValue(null)).toBe('null');
    });
  });
});

describe('plain formatter', () => {
  it('should format added property', () => {
    const filepath1 = '__tests__/__fixtures__/file1.json';
    const filepath2 = '__tests__/__fixtures__/file2.json';
    const result = genDiff(filepath1, filepath2, 'plain');

    expect(result).toBe('Property \'follow\' was removed\nProperty \'proxy\' was removed\nProperty \'timeout\' was updated. From 50 to 20\nProperty \'verbose\' was added with value: true');
  });

  it('should format removed properties', () => {
    const tree = [
      {
        key: 'key', status: 'removed', value: 'value',
      },
    ];

    expect(plain(tree)).toBe('Property \'key\' was removed');
  });

  it('should format added properties', () => {
    const tree = [
      {
        key: 'key', status: 'added', value: 'value',
      },
    ];

    expect(plain(tree)).toBe('Property \'key\' was added with value: \'value\'');
  });

  it('should format changed properties', () => {
    const tree = [
      {
        key: 'key',
        status: 'changed',
        oldValue: 'old',
        newValue: 'new',
      },
    ];

    expect(plain(tree)).toBe('Property \'key\' was updated. From \'old\' to \'new\'');
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
            oldValue: 'value1',
            newValue: 'value2',
          },
        ],
      },
    ];

    expect(plain(tree)).toBe('Property \'outer.inner\' was updated. From \'value1\' to \'value2\'');
  });

  it('should return empty string for unchanged tree', () => {
    const tree = [
      {
        key: 'key',
        status: 'unchanged',
        value: 'value',
      },
    ];

    expect(plain(tree)).toBe('');
  });

  it('should return empty string for empty tree', () => {
    expect(plain([])).toBe('');
  });

  it('should handle multiple changes', () => {
    const tree = [
      {
        key: 'a',
        status: 'unchanged',
        value: '1',
      },
      {
        key: 'b',
        status: 'changed',
        oldValue: '2',
        newValue: '3',
      },
      {
        key: 'c',
        status: 'removed',
        value: '4',
      },
      {
        key: 'd',
        status: 'added',
        value: '5',
      },
    ];

    expect(plain(tree)).toBe('Property \'b\' was updated. From \'2\' to \'3\'\nProperty \'c\' was removed\nProperty \'d\' was added with value: \'5\'');
  });
});
