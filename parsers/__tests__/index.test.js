import {
  describe, it, expect,
} from '@jest/globals';
import parseFile, {
  getParser, getFormat,
} from '../index.js';

describe('getFormat', () => {
  it('should return json for .json files', () => {
    expect(getFormat('/path/to/file.json')).toBe('json');
    expect(getFormat('file.JSON')).toBe('json');
    expect(getFormat('file.Json')).toBe('json');
  });

  it('should return yml for .yml files', () => {
    expect(getFormat('/path/to/file.yml')).toBe('yml');
    expect(getFormat('file.YML')).toBe('yml');
  });

  it('should return yaml for .yaml files', () => {
    expect(getFormat('/path/to/file.yaml')).toBe('yaml');
    expect(getFormat('file.YAML')).toBe('yaml');
  });

  it('should return format without extension', () => {
    expect(getFormat('/path/to/file.txt')).toBe('txt');
  });
});

describe('getParser', () => {
  it('should return parser for json format', () => {
    const parser = getParser('json');
    expect(typeof parser).toBe('function');
  });

  it('should return parser for yml format', () => {
    const parser = getParser('yml');
    expect(typeof parser).toBe('function');
  });

  it('should return parser for yaml format', () => {
    const parser = getParser('yaml');
    expect(typeof parser).toBe('function');
  });

  it('should throw error for unsupported format', () => {
    expect(() => getParser('xml')).toThrow('Unsupported format: xml');
    expect(() => getParser('txt')).toThrow('Unsupported format: txt');
  });
});

describe('parseFile', () => {
  it('should parse JSON file', () => {
    const result = parseFile('__tests__/__fixtures__/test.json');
    expect(result).toEqual({
      database: {
        host: 'localhost',
        port: 5432,
        name: 'mydb',
      },
      debug: true,
    });
  });

  it('should parse YAML file with .yml extension', () => {
    const result = parseFile('__tests__/__fixtures__/config1.yml');
    expect(result).toEqual({
      host: 'hexlet.io',
      timeout: 50,
      proxy: '123.234.53.22',
      follow: false,
    });
  });

  it('should parse YAML file with .yaml extension', () => {
    const result = parseFile('__tests__/__fixtures__/test.yaml');
    expect(result).toEqual({
      database: {
        host: 'localhost',
        port: 5432,
        name: 'mydb',
      },
      debug: true,
    });
  });

  it('should throw error for unsupported format', () => {
    expect(() => parseFile('__tests__/__fixtures__/file1.txt'))
      .toThrow('Unsupported format: txt');
  });
});
