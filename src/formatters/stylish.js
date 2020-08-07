import lodash from 'lodash';

const { isPlainObject, isArray, includes } = lodash;

const baseIndent = '  ';
const openingBracket = '{';
const closingBracket = '}';
const depthIncrementStep = 2;
const signsForChanges = {
  unchanged: ' ',
  removed: '-',
  added: '+',
};

const prepareValueForRender = (value, depth) => {
  if (!isPlainObject(value)) return value;
  const indent = baseIndent.repeat(depth);
  const result = Object
    .keys(value)
    .flatMap((key) => (
      `${indent}  ${key}: ${prepareValueForRender(value[key], depth + depthIncrementStep)}`
    ));
  const lastLine = `${baseIndent.repeat(depth - depthIncrementStep)}  ${closingBracket}`;
  return [openingBracket, result.join('\n'), lastLine].join('\n');
};

const nodesForRender = [
  {
    check: ({ children }) => children !== undefined,
    makeNodeForRender: ({ key, type, children }, depth, func) => {
      const value = func(children, depth + depthIncrementStep).join('\n');
      return { key, type, value };
    },
  },
  {
    check: ({ value }) => isArray(value),
    makeNodeForRender: ({ key, type, value }, depth) => {
      const [valueBefore, valueAfter] = value.map(
        (item) => prepareValueForRender(item, depth + depthIncrementStep),
      );
      return {
        key, type, valueBefore, valueAfter,
      };
    },
  },
  {
    check: () => true,
    makeNodeForRender: ({ key, type, value }, depth) => (
      { key, type, value: prepareValueForRender(value, depth + depthIncrementStep) }),
  },
];

const stringPatterns = [
  {
    check: (type) => includes(Object.keys(signsForChanges), type),
    makeStringOfChanges: ({ key, type, value }, indent) => `${indent}${signsForChanges[type]} ${key}: ${value}`,
  },
  {
    check: (type) => type === 'updated',
    makeStringOfChanges: ({ key, valueBefore, valueAfter }, indent) => `${indent}- ${key}: ${valueBefore}\n${indent}+ ${key}: ${valueAfter}`,
  },
  {
    check: (type) => type === 'complex',
    makeStringOfChanges: ({ key, value }, indent) => `${indent}  ${key}: ${openingBracket}\n${value}\n${indent}  ${closingBracket}`,
  },
];

export default (ast) => {
  const iter = (nodes, depth) => {
    const indent = baseIndent.repeat(depth);
    const result = nodes.flatMap((node) => {
      const { makeNodeForRender } = nodesForRender.find(({ check }) => check(node));
      const { makeStringOfChanges } = stringPatterns.find(({ check }) => check(node.type));
      const nodeForRender = makeNodeForRender(node, depth, iter);
      return makeStringOfChanges(nodeForRender, indent);
    });
    return result;
  };
  return [openingBracket, ...iter(ast, 1), closingBracket].join('\n');
};
