import yamlParser from 'js-yaml';
import iniParser from 'ini';

const parseJson = (jsonFile) => JSON.parse(jsonFile);

const parseYaml = (yamlFile) => yamlParser.safeLoad(yamlFile);

const parseIni = (iniFile) => iniParser.parse(iniFile);

export default {
  json: parseJson,
  ini: parseIni,
  yaml: parseYaml,
};
