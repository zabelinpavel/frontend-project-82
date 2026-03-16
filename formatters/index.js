import stylish from './stylish.js';
import plain from './plain.js';

const formatTree = (tree, formatName) => {
    if (formatName === 'stylish') {
        return stylish(tree);
    }

    if (formatName === 'plain') {
        return plain(tree);
    }

    return stylish(tree);
};

const format = (tree, formatName = 'stylish') => {
    return formatTree(tree, formatName);
};

export default format;
