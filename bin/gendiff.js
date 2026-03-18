#!/usr/bin/env node

import {
 Command, 
} from 'commander';
import generateDiff from '../index.js';

const program = new Command();

program
  .name('gendiff')
  .description('Compares two configuration files and shows a difference.')
  .version('1.0.0');

program
  .argument('<filepath1>')
  .argument('<filepath2>');

program
  .option('-f, --format <type>', 'output format', 'stylish');

program.action((filePath1, filePath2, options) => {
  const result = generateDiff(filePath1, filePath2, options.format);
  console.log(result);
});

program.parse();
