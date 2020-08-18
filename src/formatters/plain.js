import lodash from 'lodash';

const { isPlainObject } = lodash;

const formatValue = (value) => {
  if (isPlainObject(value)) return '[complex value]';
  if (typeof value === 'string') return `'${value}'`;
  return value;
};

const renderPath = (path) => `'${path.join('.')}'`;

const stringPatterns = {
  unchanged: () => null,
  updated: (propertyPath, { value }) => {
    const [valueBefore, valueAfter] = value.map(formatValue);
    return `Property ${renderPath(propertyPath)} was updated. From ${valueBefore} to ${valueAfter}`;
  },
  removed: (propertyPath) => `Property ${renderPath(propertyPath)} was removed`,
  added: (propertyPath, { value }) => `Property ${renderPath(propertyPath)} was added with value: ${formatValue(value)}`,
  complex: (propertyPath, { children }, func) => func(children, propertyPath),
};

const render = (ast, path = []) => ast
  .flatMap((node) => {
    const { key, type } = node;
    const currentPath = [...path, key];
    const makeStringOfChanges = stringPatterns[type];
    return makeStringOfChanges(currentPath, node, render);
  })
  .filter((line) => !!line)
  .join('\n');

export default render;
