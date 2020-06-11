import fs from 'fs';
import path from 'path';
import process from 'process';
import _ from 'lodash';
import { parseJson, parseYaml } from './parsers.js';

const parseFuncs = {
  json: parseJson,
  yaml: parseYaml,
};

const getFileExtension = (filepath) => path.extname(filepath).split('.').pop();

const compareObjects = (object1, object2) => {
  const allKeys = _.flattenDeep([object1, object2].map(Object.keys));
  const uniqKeys = _.uniq((allKeys));
  return uniqKeys
    .reduce((acc, key) => {
      if (_.has(object1, key) && _.has(object2, key)) {
        if (object1[key] === object2[key]) {
          acc.push(`  ${key}: ${object1[key]}`);
        } else {
          acc.push(`+ ${key}: ${object2[key]}\n- ${key}: ${object1[key]}`);
        }
      } else if (_.has(object2, key)) {
        acc.push(`+ ${key}: ${object2[key]}`);
      } else {
        acc.push(`- ${key}: ${object1[key]}`);
      }
      return acc;
    }, [])
    .join('\n');
};

export default (filepath1, filepath2) => {
  const objectsFromFiles = [filepath1, filepath2]
    .map((filepath) => path.resolve(process.cwd(), filepath))
    .map((absolutePath) => [fs.readFileSync(absolutePath, 'utf-8'), getFileExtension(absolutePath)])
    .map(([fileData, fileExtension]) => parseFuncs[fileExtension](fileData));
  return compareObjects(...objectsFromFiles);
};
