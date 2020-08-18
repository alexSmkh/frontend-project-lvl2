import lodash from 'lodash';

const { isPlainObject } = lodash;

const baseIndent = '  ';
const openingBracket = '{';
const closingBracket = '}';
const depthIncrementStep = 2;

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

const makeNodeForRender = (node, depth, func) => {
  const {
    key, type, value, children,
  } = node;

  if (type === 'complex') {
    const complexValue = func(children, depth + depthIncrementStep).join('\n');
    return { key, type, value: complexValue };
  }

  if (type === 'updated') {
    const [valueBefore, valueAfter] = value.map(
      (item) => prepareValueForRender(item, depth + depthIncrementStep),
    );
    return {
      key, type, valueBefore, valueAfter,
    };
  }

  return { key, type, value: prepareValueForRender(value, depth + depthIncrementStep) };
};

const stringPatterns = {
  unchanged: ({ key, value }, indent) => `${indent}  ${key}: ${value}`,
  added: ({ key, value }, indent) => `${indent}+ ${key}: ${value}`,
  removed: ({ key, value }, indent) => `${indent}- ${key}: ${value}`,
  updated: ({ key, valueBefore, valueAfter }, indent) => `${indent}- ${key}: ${valueBefore}\n${indent}+ ${key}: ${valueAfter}`,
  complex: ({ key, value }, indent) => `${indent}  ${key}: ${openingBracket}\n${value}\n${indent}  ${closingBracket}`,
};

export default (ast) => {
  const iter = (nodes, depth) => {
    const indent = baseIndent.repeat(depth);
    const result = nodes.flatMap((node) => {
      const makeStringOfChanges = stringPatterns[node.type];
      const nodeForRender = makeNodeForRender(node, depth, iter);
      return makeStringOfChanges(nodeForRender, indent);
    });
    return result;
  };
  return [openingBracket, ...iter(ast, 1), closingBracket].join('\n');
};
