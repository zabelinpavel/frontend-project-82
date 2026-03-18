import stylish from './stylish.js';
import plain from './plain.js';
import json from './json.js';

const formatTree = (tree, formatName) => {
  if (formatName === 'stylish') {
    return stylish(tree);
  }

  if (formatName === 'plain') {
    return plain(tree);
  }

  if (formatName === 'json') {
    return json(tree);
  }

  return stylish(tree);
};

const format = (tree, formatName = 'stylish') => formatTree(tree, formatName);

export default format;
