import plain from './plain.js';

const formatTree = (tree, formatName) => {
    if (formatName === 'plain') {
        return plain(tree);
    }

    return plain(tree);
};

const stylish = (tree, format = 'plain') => {
    return formatTree(tree, format);
};

export default stylish;
