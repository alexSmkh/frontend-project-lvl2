import lodash from 'lodash';

const { isPlainObject } = lodash;

const baseIndent = '  ';
const openingBracket = '{';
const closingBracket = '}';
const depthIncrementStep = 2;

const renderObject = (value, depth) => {
  if (!isPlainObject(value)) return value;
  const indent = baseIndent.repeat(depth);
  const result = Object
    .keys(value)
    .flatMap((key) => (
      `${indent}  ${key}: ${renderObject(value[key], depth + depthIncrementStep)}`
    ));
  const lastLine = `${baseIndent.repeat(depth - depthIncrementStep)}  ${closingBracket}`;
  return [openingBracket, result.join('\n'), lastLine].join('\n');
};

const stringPatterns = [
  {
    check: (type) => type === 'unchanged',
    makeStringOfChanges: ({ key, value }, depth) => {
      const indent = baseIndent.repeat(depth);
      return `${indent}  ${key}: ${renderObject(value, depth + depthIncrementStep)}`;
    },
  },
  {
    check: (type) => type === 'removed',
    makeStringOfChanges: ({ key, value }, depth) => {
      const indent = baseIndent.repeat(depth);
      return `${indent}- ${key}: ${renderObject(value, depth + depthIncrementStep)}`;
    },
  },
  {
    check: (type) => type === 'added',
    makeStringOfChanges: ({ key, value }, depth) => {
      const indent = baseIndent.repeat(depth);
      return `${indent}+ ${key}: ${renderObject(value, depth + depthIncrementStep)}`;
    },
  },
  {
    check: (type) => type === 'updated',
    makeStringOfChanges: ({ key, value }, depth) => {
      const [valueBefore, valueAfter] = value;
      const indent = baseIndent.repeat(depth);
      return `${indent}- ${key}: ${renderObject(valueBefore, depth + depthIncrementStep)}\n${indent}+ ${key}: ${renderObject(valueAfter, depth + depthIncrementStep)}`;
    },
  },
  {
    check: (type) => type === 'complex',
    makeStringOfChanges: ({ key, children }, depth, func) => {
      const complexValue = func(children, depth + 2).join('\n');
      const indent = baseIndent.repeat(depth);
      return `${indent}  ${key}: ${openingBracket}\n${complexValue}\n${indent}  ${closingBracket}`;
    },
  },
];

export default (ast) => {
  const iter = (nodes, depth) => {
    const result = nodes.flatMap((node) => {
      const { makeStringOfChanges } = stringPatterns.find(({ check }) => check(node.type));
      return makeStringOfChanges(node, depth, iter);
    });
    return result;
  };
  return [openingBracket, ...iter(ast, 1), closingBracket].join('\n');
};
