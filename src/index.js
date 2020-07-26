import fs from 'fs';
import path from 'path';
import process from 'process';
import lodash from 'lodash';
import parseFuncs from './parsers.js';
import getFormatter from './formatters/index.js';

const {
  isPlainObject, isEqual, flatten, union,
} = lodash;

const getFileExtension = (filepath) => path.extname(filepath).split('.').pop();

const nodes = [
  {
    check: (previousValue, currentValue) => isEqual(previousValue, currentValue),
    makeNode: (key, _, value) => ({ key, typeOfChange: 'unchanged', value }),
  },
  {
    check: (previousValue) => previousValue === undefined,
    makeNode: (key, _, value) => ({ key, typeOfChange: 'added', value }),
  },
  {
    check: (_, currentValue) => currentValue === undefined,
    makeNode: (key, value) => ({ key, typeOfChange: 'removed', value }),
  },
  {
    check: (previousValue, currentValue) => (
      isPlainObject(previousValue) && isPlainObject(currentValue)
    ),
    makeNode: (key, previousValue, currentValue, func) => (
      { key, typeOfChange: 'updatedObject', value: func(previousValue, currentValue) }
    ),
  },
  {
    check: (previousValue, currentValue) => !isEqual(previousValue, currentValue),
    makeNode: (key, previousValue, currentValue) => (
      { key, typeOfChange: 'updated', value: [previousValue, currentValue] }
    ),
  },
];

const buildAst = (previousObj, currentObj) => {
  const keys = union(flatten([previousObj, currentObj].map(Object.keys)));
  return keys.reduce((acc, key) => {
    const previous = previousObj[key];
    const current = currentObj[key];
    const { makeNode } = nodes.find(({ check }) => check(previous, current));
    return [...acc, makeNode(key, previous, current, buildAst)];
  }, []);
};

export default (filepath1, filepath2, format) => {
  const objectsFromFiles = [filepath1, filepath2]
    .map((filepath) => path.resolve(process.cwd(), filepath))
    .map((absolutePath) => [fs.readFileSync(absolutePath, 'utf-8'), getFileExtension(absolutePath)])
    .map(([fileData, fileExtension]) => parseFuncs[fileExtension](fileData));
  const ast = buildAst(...objectsFromFiles);
  return getFormatter(format)(ast);
};
