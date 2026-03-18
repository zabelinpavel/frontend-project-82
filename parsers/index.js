import path from 'path';
import parseJSON from './json.js';
import parseYaml from './yaml.js';

const getFormat = (filePath) => path.extname(filePath)
  .slice(1).toLowerCase();

const parsers = {
  json: parseJSON,
  yml: parseYaml,
  yaml: parseYaml,
};

const getParser = (format) => {
  const parser = parsers[format];
  if (!parser) {
    throw new Error(`Unsupported format: ${format}`);
  }

  return parser;
};

const parseFile = (filePath) => {
  const absolutePath = path.resolve(process.cwd(), filePath);
  const format = getFormat(absolutePath);
  const parser = getParser(format);

  return parser(absolutePath);
};

export default parseFile;
export { getParser, getFormat };
