export const isObject = (value) => {
  if (value === null) return false;
  return typeof value === 'object';
};

export const formatValue = (value) => {
  if (!isObject(value)) {
    return typeof value === 'string' ? `'${value}'` : String(value);
  }
  return '[complex value]';
};

/* eslint-disable no-use-before-define */
function formatNode(node, path = '') {
  const {
    key, status, children, value, oldValue, newValue,
  } = node;
  const fullPath = path ? `${path}.${key}` : key;

  if (status === 'unchanged') return '';

  if (status === 'added') {
    return `Property '${fullPath}' was added with value: ${formatValue(value)}`;
  }

  if (status === 'removed') {
    return `Property '${fullPath}' was removed`;
  }

  if (status === 'changed') {
    if (children) {
      return formatTree(children, fullPath);
    }
    return `Property '${fullPath}' was updated. From ${formatValue(oldValue)} to ${formatValue(newValue)}`;
  }

  return '';
}
/* eslint-enable no-use-before-define */

function formatTree(tree, path = '') {
  const lines = tree
    .map((node) => formatNode(node, path))
    .filter((line) => line !== '');
  return lines.join('\n');
}

const plain = (tree) => {
  if (!Array.isArray(tree) || tree.length === 0) {
    return '';
  }

  return formatTree(tree);
};

export default plain;
