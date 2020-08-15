import lodash from 'lodash';

const { isPlainObject } = lodash;

const formatValue = (value) => {
  if (isPlainObject(value)) return '[complex value]';
  if (typeof value === 'string') return `'${value}'`;
  return value;
};

const renderPath = (path) => (path ? `'${path.join('.')}'` : '');

const stringPatterns = {
  unchanged: () => '',
  updated: (propertyPath, { value }) => {
    const [valueBefore, valueAfter] = value.map(formatValue);
    return `Property ${renderPath(propertyPath)} was updated. From ${valueBefore} to ${valueAfter}`;
  },
  removed: (propertyPath) => `Property ${renderPath(propertyPath)} was removed`,
  added: (propertyPath, { value }) => `Property ${renderPath(propertyPath)} was added with value: ${formatValue(value)}`,
  complex: (propertyPath, { children }, func) => (
    children.flatMap((child) => func(child, propertyPath))
  ),
};

const render = (ast) => {
  const iter = (node, path) => {
    const currentPath = [...path, node.key];
    const makeStringOfChanges = stringPatterns[node.type];
    return makeStringOfChanges(currentPath, node, iter);
  };
  const result = ast
    .flatMap((node) => iter(node, []))
    .filter((line) => line !== '');
  return result.join('\n');
};

export default render;
