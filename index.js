import path from 'path';
import fs from 'fs';
import _ from 'lodash';

const genDiff = (filepath1, filepath2) => {

    const absolutePath1 = path.resolve(process.cwd(), filepath1);
    const absolutePath2 = path.resolve(process.cwd(), filepath2);

    const data1 = JSON.parse(fs.readFileSync(absolutePath1, 'utf-8'));
    const data2 = JSON.parse(fs.readFileSync(absolutePath2, 'utf-8'));

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
        ]
    })

    return `{\n${lines.join('\n')}\n}`;
}

export default genDiff;
