#!/usr/bin/env node

import { Command } from "commander";
import genDiff from "../index.js";

const program = new Command();

program
    .name('gendiff')
    .description('Compares two configuration files and shows a difference.')
    .version('1.0.0');

program
    .argument('<filepath1>')
    .argument('<filepath2>')

program
    .option('-f, --format <type>', 'output format');

program.action((filePath1, filePath2) => {
    const result = genDiff(filePath1, filePath2);
    console.log(result);
});

program.parse();
