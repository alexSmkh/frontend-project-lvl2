import lodash from 'lodash';

const { isPlainObject } = lodash;

const baseIndent = '  ';

const stringPatterns = [
  {
    check: (typeOfChange) => typeOfChange === 'unchanged',
    makeStringOfChanges: (key, indent, previousValue) => `${indent}  ${key}: ${previousValue}`,
  },
  {
    check: (typeOfChange) => typeOfChange === 'changed',
    makeStringOfChanges: (key, indent, previousValue, currentValue) => `${indent}+ ${key}: ${currentValue}\n${indent}- ${key}: ${previousValue}`,
  },
  {
    check: (typeOfChange) => typeOfChange === 'removed',
    makeStringOfChanges: (key, indent, previousValue) => `${indent}- ${key}: ${previousValue}`,
  },
  {
    check: (typeOfChange) => typeOfChange === 'added',
    makeStringOfChanges: (key, indent, _, currentValue) => `${indent}+ ${key}: ${currentValue}`,
  },
  {
    check: (typeOfChange) => typeOfChange === 'complex',
    makeStringOfChanges: (key, indent, complexValue) => `${indent}  ${key}: {\n${complexValue}\n${indent}  }`,
  },
];

const objToStr = (obj, depth) => {
  const indent = baseIndent.repeat(depth);
  const result = Object
    .keys(obj)
    .reduce((acc, key) => {
      const value = (isPlainObject(obj[key])) ? objToStr(obj[key], depth + 1) : obj[key];
      return [...acc, `${indent}  ${key}: ${value}`];
    }, ['{']);
  result.push(`${baseIndent.repeat(depth - 1)}  }`);
  return result.join('\n');
};

export default (ast) => {
  const iter = (currentAst, depth) => {
    const currentIndent = baseIndent.repeat(depth);
    return Object
      .keys(currentAst)
      .reduce((acc, key) => {
        const { typeOfChange, previousValue, currentValue } = currentAst[key];
        const { makeStringOfChanges } = stringPatterns.find(({ check }) => check(typeOfChange));

        if (typeOfChange === 'complex') {
          const formattedComplexValue = iter(currentValue, depth + 1);
          return [...acc, makeStringOfChanges(key, currentIndent, formattedComplexValue)];
        }

        const previous = (isPlainObject(previousValue))
          ? objToStr(previousValue, depth + 1) : previousValue;
        const current = (isPlainObject(currentValue))
          ? objToStr(currentValue, depth + 1) : currentValue;
        return [
          ...acc,
          makeStringOfChanges(key, currentIndent, previous, current),
        ];
      }, [])
      .join('\n');
  };
  const result = iter(ast, 1);
  return ['{', result, '}'].join('\n');
};
