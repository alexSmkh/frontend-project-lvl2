import _ from 'lodash';
import stylish from './stylish.js';
import plain from './plain.js';
import json from './json.js';

const formatters = {
  stylish,
  plain,
  json,
};

/*

Похожий интерфей есть еще в src/parsers.js, на который ругается codeclimate(дублирование кода).
Нужно ли выносить их в отдельную функию? Например:

const func = (items, item, partOfErrorMessage)
if (!_.has(items, item)) {
  const availableItems = Object.keys(items).join(', ');
  throw new Error(`"${item}" ${partOfErrorMessage} ${availableFormatters}.`);
}
return items[item];
}

Хотя вынос одного интерфейса на несколько модулей кажется странным решением =\
*/

export default (formatter) => {
  if (!_.has(formatters, formatter)) {
    const availableFormatters = Object.keys(formatters).join(', ');
    throw new Error(`"${formatter}" formatting is not supported!\nAvailable formatters: ${availableFormatters}.`);
  }
  return formatters[formatter];
};
