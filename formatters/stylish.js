const INDENT_SIZE = 4;

const isObject = (value) => {
  if (value === null) return false;
  return typeof value === 'object';
};

const getIndent = (depth, sign = ' ') => {
  const indentSize = depth * INDENT_SIZE;
  return `${' '.repeat(indentSize - 2)}${sign} `;
};

const formatValue = (value, depth) => {
  if (value === null) return 'null';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (!isObject(value)) return String(value);

  const indent = depth * INDENT_SIZE;
  const closingIndent = (depth - 1) * INDENT_SIZE;

  const lines = Object.entries(value).map(
    ([key, val]) =>
      `${' '.repeat(indent)}${key}: ${formatValue(val, depth + 1)}`,
  );

  return `{\n${lines.join('\n')}\n${' '.repeat(closingIndent)}}`;
};

const formatTree = (tree, depth = 1) => (
  tree.map((node) => formatNode(node, depth)).join('\n')
);

const formatNode = (node, depth) => {
  const {
    key,
    status,
    children,
    value,
    oldValue,
    newValue,
  } = node;

  switch (status) {
    case 'unchanged':
      return `${getIndent(depth)}${key}: ${formatValue(value, depth + 1)}`;

    case 'added':
      return `${getIndent(depth, '+')}${key}: ${formatValue(value, depth + 1)}`;

    case 'removed':
      return `${getIndent(depth, '-')}${key}: ${formatValue(value, depth + 1)}`;

    case 'changed':
      if (children) {
        return `${getIndent(depth)}${key}: {\n${formatTree(children, depth + 1)}\n${' '.repeat(depth * INDENT_SIZE)}}`;
      }
      return [
        `${getIndent(depth, '-')}${key}: ${formatValue(oldValue, depth + 1)}`,
        `${getIndent(depth, '+')}${key}: ${formatValue(newValue, depth + 1)}`,
      ].join('\n');

    default:
      return '';
  }
};

const stylish = (tree) => {
  if (!Array.isArray(tree) || tree.length === 0) {
    return '{}';
  }

  const formatted = formatTree(tree);
  return `{\n${formatted}\n}`;
};

export default stylish;
