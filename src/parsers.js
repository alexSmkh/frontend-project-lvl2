import _ from 'lodash';
import yamlParser from 'js-yaml';
import iniParser from 'ini';

const parsers = {
  json: (jsonFile) => JSON.parse(jsonFile),
  ini: (iniFile) => iniParser.parse(iniFile),
  yaml: (yamlFile) => yamlParser.safeLoad(yamlFile),
};

export default (extension) => {
  if (!_.has(parsers, extension)) {
    const availableFormats = Object.keys(parsers).join(', ');
    throw new Error(`"${extension}" format is not supported!\nAvailable formats: ${availableFormats}.`);
  }
  return parsers[extension];
};
