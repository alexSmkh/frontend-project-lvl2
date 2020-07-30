import lodash from 'lodash';

const { isArray, isPlainObject, flattenDeep } = lodash;

const stringPatterns = [
  {
    check: (typeOfChange) => typeOfChange === 'unchanged',
    makeStringOfChanges: () => '',
  },
  {
    check: (typeOfChange) => typeOfChange === 'updated',
    makeStringOfChanges: (property, previous, current) => `Property ${property} was updated. From ${previous} to ${current}`,
  },
  {
    check: (typeOfChange) => typeOfChange === 'removed',
    makeStringOfChanges: (property) => `Property ${property} was removed`,
  },
  {
    check: (typeOfChange) => typeOfChange === 'added',
    makeStringOfChanges: (property, value) => `Property ${property} was added with value: ${value}`,
  },
];

const formatValue = (value) => {
  if (isPlainObject(value)) return '[complex value]';
  if (typeof value === 'string') return `'${value}'`;
  return value;
};

const formatProperty = (prop) => (prop ? `'${prop.join('.')}'` : '');

const render = (ast) => {
  const iter = (node, path) => {
    const { key, typeOfChange, value } = node;
    const currentPath = [...path, key];
    if (typeOfChange === 'updatedObject') {
      return value.reduce((acc, child) => [...acc, iter(child, currentPath)], []);
    }
    const { makeStringOfChanges } = stringPatterns.find(({ check }) => check(typeOfChange));
    const property = formatProperty(currentPath);
    if (isArray(value)) {
      return makeStringOfChanges(property, ...value.map(formatValue));
    }
    return makeStringOfChanges(property, formatValue(value));
  };
  const result = ast
    .reduce((acc, obj) => flattenDeep([...acc, iter(obj, [])]), [])
    .filter((line) => line !== '');
  return result.join('\n');
};

export default render;
