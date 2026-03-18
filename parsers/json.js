import fs from 'fs';

const parseJSON = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
};

export default parseJSON;
