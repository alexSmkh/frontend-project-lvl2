import lodash from 'lodash';

const { isPlainObject, isArray } = lodash;

const baseIndent = '  ';

const formatValue = (value, depth) => {
  if (!isPlainObject(value)) return value;
  const indent = baseIndent.repeat(depth);
  const result = Object
    .keys(value)
    .reduce((acc, key) => (
      [...acc, `${indent}  ${key}: ${formatValue(value[key], depth + 1)}`]
    ), ['{']);
  result.push(`${baseIndent.repeat(depth - 1)}  }`);
  return result.join('\n');
};

const stringPatterns = [
  {
    check: (typeOfChange) => typeOfChange === 'unchanged',
    makeStringOfChanges: (key, indent, value) => `${indent}  ${key}: ${value}`,
  },
  {
    check: (typeOfChange) => typeOfChange === 'removed',
    makeStringOfChanges: (key, indent, value) => `${indent}- ${key}: ${value}`,
  },
  {
    check: (typeOfChange) => typeOfChange === 'added',
    makeStringOfChanges: (key, indent, value) => `${indent}+ ${key}: ${value}`,
  },
  {
    check: (typeOfChange) => typeOfChange === 'updated',
    makeStringOfChanges: (key, indent, previous, current) => (
      `${indent}+ ${key}: ${current}\n${indent}- ${key}: ${previous}`
    ),
  },
];

export default (ast) => {
  const iter = (node, depth) => {
    const indent = baseIndent.repeat(depth);
    const result = node.flatMap(({ key, typeOfChange, value }) => {
      if (typeOfChange === 'updatedObject') {
        return `${indent}  ${key}: {\n${iter(value, depth + 1).join('\n')}\n${indent}  }`;
      }
      const { makeStringOfChanges } = stringPatterns.find(({ check }) => check(typeOfChange));
      if (isArray(value)) {
        const previous = formatValue(value[0], depth + 1);
        const current = formatValue(value[1], depth + 1);
        return makeStringOfChanges(key, indent, previous, current);
      }
      return makeStringOfChanges(key, indent, formatValue(value, depth + 1));
    });
    return result;
  };
  return ['{', ...iter(ast, 1), '}'].join('\n');
};
