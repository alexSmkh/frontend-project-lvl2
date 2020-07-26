import _ from 'lodash';
import stylish from './stylish.js';
import plain from './plain.js';

const formatters = {
  stylish,
  plain,
};

export default (formatter) => {
  if (!_.has(formatters, formatter)) {
    const availableFormatters = Object.keys(formatters).join(',');
    throw new Error(`"${formatter}" formatting is not supported!\nAvailable formatters: ${availableFormatters}.`);
  }
  return formatters[formatter];
};
