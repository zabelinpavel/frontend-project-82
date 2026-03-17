const INDENT_SIZE = 2;
const BASE_INDENT = 4;

const isObject = (value) => {
    if (value === null) return false;
    return typeof value === 'object';
};

const formatValue = (value, indent) => {
    if (value === null) {
        return 'null';
    }

    if (typeof value === 'boolean') {
        return value ? 'true' : 'false';
    }

    if (!isObject(value)) {
        return String(value);
    }

    const entries = Object.entries(value);
    if (entries.length === 0) {
        return '{}';
    }

    const innerIndent = indent + INDENT_SIZE;
    const indentStr = ' '.repeat(innerIndent);
    const closingIndent = ' '.repeat(indent);

    const lines = entries.map(([key, val]) => {
        const formattedVal = formatValue(val, innerIndent);
        return `${indentStr}${key}: ${formattedVal}`;
    });

    return `{\n${lines.join('\n')}\n${closingIndent}}`;
};

const formatNode = (node, indent) => {
    const { key, status, children, value, oldValue, newValue } = node;
    const indentStr = ' '.repeat(indent);

    if (status === 'unchanged') {
        return `${indentStr}  ${key}: ${formatValue(value, indent + INDENT_SIZE)}`;
    }

    if (status === 'added') {
        return `${indentStr}+ ${key}: ${formatValue(value, indent + INDENT_SIZE)}`;
    }

    if (status === 'removed') {
        return `${indentStr}- ${key}: ${formatValue(value, indent + INDENT_SIZE)}`;
    }

    if (status === 'changed') {
        if (children) {
            const childrenFormatted = formatTree(children, indent + INDENT_SIZE);
            return `${indentStr}  ${key}: {\n${childrenFormatted}\n${indentStr}}`;
        }
        return [
            `${indentStr}- ${key}: ${formatValue(oldValue, indent + INDENT_SIZE)}`,
            `${indentStr}+ ${key}: ${formatValue(newValue, indent + INDENT_SIZE)}`
        ].join('\n');
    }

    return '';
};

const formatTree = (tree, indent = BASE_INDENT) => {
    const lines = tree.map((node) => formatNode(node, indent));
    return lines.join('\n');
};

const stylish = (tree) => {
    if (!Array.isArray(tree) || tree.length === 0) {
        return '{}';
    }

    const formatted = formatTree(tree);
    return `{\n${formatted}\n}`;
};

export default stylish;
