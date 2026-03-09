import path from 'path';
import fs from 'fs';
import _ from 'lodash';

const parseFile = (filePath) => {
    const absolutePath = path.resolve(process.cwd(), filePath);
    return JSON.parse(fs.readFileSync(absolutePath, 'utf-8'));
};

const buildDiffLines = (data1, data2) => {
    const keys1 = Object.keys(data1);
    const keys2 = Object.keys(data2);

    const allKeys = _.sortBy(_.union(keys1, keys2));

    const lines = allKeys.flatMap((key) => {
        if (!Object.hasOwn(data2, key)) {
            return `  - ${key}: ${data1[key]}`;
        }

        if (!Object.hasOwn(data1, key)) {
            return `  + ${key}: ${data2[key]}`;
        }

        if (data1[key] === data2[key]) {
            return `    ${key}: ${data1[key]}`;
        }

        return [
            `  - ${key}: ${data1[key]}`,
            `  + ${key}: ${data2[key]}`
        ];
    });

    return `{\n${lines.join('\n')}\n}`;
};

const generateDiff = (filepath1, filepath2) => {
    const data1 = parseFile(filepath1);
    const data2 = parseFile(filepath2);

    return buildDiffLines(data1, data2);
};

export default generateDiff;
export { parseFile, buildDiffLines };
