import _ from 'lodash';
import yamlParser from 'js-yaml';
import iniParser from 'ini';

const parseJson = (jsonFile) => JSON.parse(jsonFile);

const parseYaml = (yamlFile) => yamlParser.safeLoad(yamlFile);

const parseIni = (iniFile) => iniParser.parse(iniFile);

const parsers = {
  json: parseJson,
  ini: parseIni,
  yaml: parseYaml,
};

export default (extension) => {
  if (!_.has(parsers, extension)) {
    const availableFormats = Object.keys(parsers).join(',');
    throw new Error(`"${extension}" format is not supported!\nAvailable formats: ${availableFormats}.`);
  }
  return parsers[extension];
};
