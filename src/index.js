import fs from 'fs';
import path from 'path';
import process from 'process';
import lodash from 'lodash';
import getParser from './parsers.js';
import getFormatter from './formatters/index.js';

const {
  isPlainObject, isEqual, flatten, union, sortBy,
} = lodash;

const getFileExtension = (filepath) => path.extname(filepath).slice(1);

const nodes = [
  {
    check: (valueBefore, valueAfter) => isEqual(valueBefore, valueAfter),
    makeNode: (key, _, value) => ({ key, type: 'unchanged', value }),
  },
  {
    check: (valueBefore) => valueBefore === undefined,
    makeNode: (key, _, value) => ({ key, type: 'added', value }),
  },
  {
    check: (_, valueAfter) => valueAfter === undefined,
    makeNode: (key, value) => ({ key, type: 'removed', value }),
  },
  {
    check: (valueBefore, valueAfter) => (
      isPlainObject(valueBefore) && isPlainObject(valueAfter)
    ),
    makeNode: (key, valueBefore, valueAfter, func) => (
      { key, type: 'complex', children: func(valueBefore, valueAfter) }
    ),
  },
  {
    check: (valueBefore, valueAfter) => !isEqual(valueBefore, valueAfter),
    makeNode: (key, valueBefore, valueAfter) => (
      { key, type: 'updated', value: [valueBefore, valueAfter] }
    ),
  },
];

const buildAst = (objectBefore, objectAfter) => {
  const keys = union(flatten([objectBefore, objectAfter].map(Object.keys)));
  const result = keys.flatMap((key) => {
    const valueBefore = objectBefore[key];
    const valueAfter = objectAfter[key];
    const { makeNode } = nodes.find(({ check }) => check(valueBefore, valueAfter));
    return [makeNode(key, valueBefore, valueAfter, buildAst)];
  });
  return sortBy(result, (item) => item.key);
};

export default (filepath1, filepath2, format) => {
  const objectsFromFiles = [filepath1, filepath2]
    .map((filepath) => path.resolve(process.cwd(), filepath))
    .map((absoluteFilepath) => [fs.readFileSync(absoluteFilepath, 'utf-8'), getFileExtension(absoluteFilepath)])
    .map(([fileData, fileExtension]) => getParser(fileExtension)(fileData));
  const ast = buildAst(...objectsFromFiles);
  return getFormatter(format)(ast);
};
