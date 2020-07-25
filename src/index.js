import fs from 'fs';
import path from 'path';
import process from 'process';
import lodash from 'lodash';
import parseFuncs from './parsers.js';
import getFormatter from './formatters/main.js';

const {
  isPlainObject, isEqual, flatten, union,
} = lodash;


const getFileExtension = (filepath) => path.extname(filepath).split('.').pop();

const typesOfChanges = [
  {
    typeOfChange: 'unchanged',
    check: (previousValue, currentValue) => isEqual(previousValue, currentValue),
  },
  {
    typeOfChange: 'added',
    check: (previousValue) => previousValue === undefined,
  },
  {
    typeOfChange: 'removed',
    check: (_, currentValue) => currentValue === undefined,
  },
  {
    typeOfChange: 'complex',
    check: (previousValue, currentValue) => (
      isPlainObject(previousValue) && isPlainObject(currentValue)
    ),
  },
  {
    typeOfChange: 'changed',
    check: (previousValue, currentValue) => !isEqual(previousValue, currentValue),
  },
];

const buildAst = (objs) => {
  const [previousObj, currentObj] = objs;
  const keys = union(flatten(objs.map(Object.keys)));
  return keys.reduce((acc, key) => {
    const previousValue = previousObj[key];
    const currentValue = currentObj[key];
    const { typeOfChange } = typesOfChanges.find(({ check }) => check(previousValue, currentValue));
    if (typeOfChange === 'complex') {
      return {
        ...acc,
        [key]: {
          typeOfChange: 'complex',
          currentValue: buildAst([previousValue, currentValue]),
        },
      };
    }
    return { ...acc, [key]: { typeOfChange, previousValue, currentValue } };
  }, {});
};

export default (filepath1, filepath2, format) => {
  const objectsFromFiles = [filepath1, filepath2]
    .map((filepath) => path.resolve(process.cwd(), filepath))
    .map((absolutePath) => [fs.readFileSync(absolutePath, 'utf-8'), getFileExtension(absolutePath)])
    .map(([fileData, fileExtension]) => parseFuncs[fileExtension](fileData));
  const ast = buildAst(objectsFromFiles);
  return getFormatter(format)(ast);
};
