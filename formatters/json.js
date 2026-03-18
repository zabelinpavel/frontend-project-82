const INDENT_SIZE = 2;

export const isObject = (value) => {
  if (value === null) return false;
  return typeof value === 'object';
};

const formatIndent = (indent) => ' '.repeat(indent);

export const formatValue = (value, indent) => {
  if (value === null) {
    return 'null';
  }

  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }

  if (typeof value === 'number') {
    return String(value);
  }

  if (typeof value === 'string') {
    return `"${value}"`;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return '[]';
    }
    const innerIndent = indent + INDENT_SIZE;
    const indentStr = formatIndent(innerIndent);
    const closingIndent = formatIndent(indent);
    const items = value.map((item) => `${indentStr}${formatValue(item, innerIndent)}`);
    return `[\n${items.join(',\n')}\n${closingIndent}]`;
  }

  if (isObject(value)) {
    const entries = Object.entries(value);
    if (entries.length === 0) {
      return '{}';
    }
    const innerIndent = indent + INDENT_SIZE;
    const indentStr = formatIndent(innerIndent);
    const closingIndent = formatIndent(indent);
    const items = entries.map(([key, val]) => {
      const formattedVal = formatValue(val, innerIndent);
      return `${indentStr}"${key}": ${formattedVal}`;
    });
    return `{\n${items.join(',\n')}\n${closingIndent}}`;
  }

  return String(value);
};

export const formatNode = (node, indent) => {
  const {
    key,
    status,
    children,
    value,
    oldValue,
    newValue,
  } = node;
  const indentStr = formatIndent(indent);

  const baseLines = [
    `${indentStr}{`,
    `${formatIndent(indent + INDENT_SIZE)}"key": "${key}",`,
    `${formatIndent(indent + INDENT_SIZE)}"status": "${status}",`,
  ];

  const contentLines = children
    ? [
      `${formatIndent(indent + INDENT_SIZE)}"children": [`,
      children.map((child) => formatNode(child, indent + INDENT_SIZE * 2)).join(',\n'),
      `${formatIndent(indent + INDENT_SIZE)}]`,
    ]
    : status === 'changed'
      ? [
        `${formatIndent(indent + INDENT_SIZE)}"oldValue": ${formatValue(oldValue, indent + INDENT_SIZE)},`,
        `${formatIndent(indent + INDENT_SIZE)}"newValue": ${formatValue(newValue, indent + INDENT_SIZE)}`,
      ]
      : [
        `${formatIndent(indent + INDENT_SIZE)}"value": ${formatValue(value, indent + INDENT_SIZE)}`,
      ];

  const allLines = [...baseLines, ...contentLines, `${indentStr}}`];

  return allLines.join('\n');
};

const json = (tree) => {
  if (!Array.isArray(tree)) {
    return '[]';
  }

  if (tree.length === 0) {
    return '[]';
  }

  const nodes = tree.map((node) => formatNode(node, INDENT_SIZE));
  return `[\n${nodes.join(',\n')}\n]`;
};

export default json;
