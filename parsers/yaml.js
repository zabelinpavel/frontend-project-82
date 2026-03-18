import fs from 'fs';
import yaml from 'js-yaml';

const parseYaml = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf-8');
  return yaml.load(content);
};

export default parseYaml;
