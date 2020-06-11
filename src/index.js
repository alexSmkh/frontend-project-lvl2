import fs from 'fs';
import path from 'path';
import process from 'process';
import _ from 'lodash';

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
  const objectsFromJson = [filepath1, filepath2]
    .map((filepath) => path.resolve(process.cwd(), filepath))
    .map((absoluteFilepath) => fs.readFileSync(absoluteFilepath, 'utf-8'))
    .map(JSON.parse);
  return compareObjects(...objectsFromJson);
};
