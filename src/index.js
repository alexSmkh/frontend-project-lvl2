import fs from 'fs';
import path from 'path';
import process from 'process';
import _ from 'lodash';

const compareFiles = (file1, file2) => {
  const allKeys = _.flattenDeep([file1, file2].map(Object.keys));
  const uniqKeys = _.uniq((allKeys));
  return uniqKeys
    .reduce((acc, key) => {
      if (_.has(file1, key) && _.has(file2, key)) {
        if (file1[key] === file2[key]) {
          acc.push(`  ${key}: ${file1[key]}`);
        } else {
          acc.push(`+ ${key}: ${file2[key]}\n- ${key}: ${file1[key]}`);
        }
      } else if (_.has(file2, key)) {
        acc.push(`+ ${key}: ${file2[key]}`);
      } else {
        acc.push(`- ${key}: ${file1[key]}`);
      }
      return acc;
    }, [])
    .join('\n');
};

export default (filepath1, filepath2) => {
  const jsonFiles = [filepath1, filepath2]
    .map((filepath) => path.resolve(process.cwd(), filepath))
    .map((absoluteFilepath) => fs.readFileSync(absoluteFilepath, 'utf-8'))
    .map(JSON.parse);
  console.log(compareFiles(...jsonFiles));
};
