import { describe, it, expect } from '@jest/globals';
import stylish from '../stylish.js';

describe('stylish formatter', () => {
  it('should return empty object for empty tree', () => {
    const result = stylish([]);
    expect(result).toBe('{}');
  });

  it('should format flat objects', () => {
    const tree = [
      { key: 'follow', status: 'removed', value: false },
      { key: 'host', status: 'unchanged', value: 'hexlet.io' },
      { key: 'proxy', status: 'removed', value: '123.234.53.22' },
      {
        key: 'timeout',
        status: 'changed',
        oldValue: 50,
        newValue: 20,
      },
      { key: 'verbose', status: 'added', value: true },
    ];
    const result = stylish(tree);
    const expected = `{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}`;
    expect(result).toBe(expected);
  });

  it('should format nested objects', () => {
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
          { key: 'setting5', status: 'added', value: { key5: 'value5' } },
          {
            key: 'setting6',
            status: 'changed',
            children: [
              {
                key: 'doge',
                status: 'changed',
                children: [
                  {
                    key: 'wow',
                    status: 'changed',
                    oldValue: '',
                    newValue: 'so much',
                  },
                ],
              },
              { key: 'key', status: 'unchanged', value: 'value' },
              { key: 'ops', status: 'added', value: 'vops' },
            ],
          },
        ],
      },
      {
        key: 'group1',
        status: 'changed',
        children: [
          {
            key: 'baz',
            status: 'changed',
            oldValue: 'bas',
            newValue: 'bars',
          },
          { key: 'foo', status: 'unchanged', value: 'bar' },
          {
            key: 'nest',
            status: 'changed',
            oldValue: { key: 'value' },
            newValue: 'str',
          },
        ],
      },
      {
        key: 'group2',
        status: 'removed',
        value: {
          abc: 12345,
          deep: { id: 45 },
        },
      },
      {
        key: 'group3',
        status: 'added',
        value: {
          deep: { id: { number: 45 } },
          fee: 100500,
        },
      },
    ];
    const result = stylish(tree);
    const expected = `{
    common: {
      + follow: false
        setting1: Value 1
      - setting2: 200
      - setting3: true
      + setting3: null
      + setting4: blah blah
      + setting5: {
            key5: value5
        }
        setting6: {
            doge: {
              - wow: 
              + wow: so much
            }
            key: value
          + ops: vops
        }
    }
    group1: {
      - baz: bas
      + baz: bars
        foo: bar
      - nest: {
            key: value
        }
      + nest: str
    }
  - group2: {
        abc: 12345
        deep: {
            id: 45
        }
    }
  + group3: {
        deep: {
            id: {
                number: 45
            }
        }
        fee: 100500
    }
}`;
    expect(result).toBe(expected);
  });
});
