import _ from 'lodash';
import parseFile from './parsers/index.js';
import stylish from './formatters/index.js';

const isObject = (value) => {
  if (value === null) return false;
  return typeof value === 'object';
};

const buildDiffTree = (data1, data2) => {
  const keys1 = Object.keys(data1);
  const keys2 = Object.keys(data2);

  const allKeys = _.sortBy(_.union(keys1, keys2));

  return allKeys.map((key) => {
    const value1 = data1[key];
    const value2 = data2[key];

    const hasKey1 = Object.hasOwn(data1, key);
    const hasKey2 = Object.hasOwn(data2, key);

    if (!hasKey2) {
      return {
        key, status: 'removed', value: value1,
      };
    }

    if (!hasKey1) {
      return {
        key, status: 'added', value: value2,
      };
    }

    if (isObject(value1) && isObject(value2)) {
      return {
        key,
        status: 'changed',
        children: buildDiffTree(value1, value2),
      };
    }

    if (value1 === value2) {
      return {
        key,
        status: 'unchanged',
        value: value1,
      };
    }

    return {
      key,
      status: 'changed',
      oldValue: value1,
      newValue: value2,
    };
  });
};

const genDiff = (filepath1, filepath2, format = 'stylish') => {
  const data1 = parseFile(filepath1);
  const data2 = parseFile(filepath2);

  const tree = buildDiffTree(data1, data2);

  return stylish(tree, format);
};

export default genDiff;
export {
  buildDiffTree, parseFile,
};
