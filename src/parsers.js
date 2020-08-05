import _ from 'lodash';
import yamlParser from 'js-yaml';
import iniParser from 'ini';

const parsers = {
  json: (jsonData) => JSON.parse(jsonData),
  ini: (iniData) => iniParser.parse(iniData),
  yaml: (yamlData) => yamlParser.safeLoad(yamlData),
};

export default (extension) => {
  if (!_.has(parsers, extension)) {
    const availableFormats = Object.keys(parsers).join(', ');
    throw new Error(`"${extension}" format is not supported!\nAvailable formats: ${availableFormats}.`);
  }
  return parsers[extension];
};
