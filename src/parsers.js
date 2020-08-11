import _ from 'lodash';
import yamlParser from 'js-yaml';
import iniParser from 'ini';

const parsers = {
  json: JSON.parse,
  ini: iniParser.parse,
  yaml: yamlParser.safeLoad,
};

export default (extension) => {
  if (!_.has(parsers, extension)) {
    const availableFormats = Object.keys(parsers).join(', ');
    throw new Error(`"${extension}" format is not supported!\nAvailable formats: ${availableFormats}.`);
  }
  return parsers[extension];
};
