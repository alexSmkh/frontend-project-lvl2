import yamlParser from 'js-yaml';

export const parseJson = (jsonFile) => JSON.parse(jsonFile);

export const parseYaml = (yamlFile) => yamlParser.safeLoad(yamlFile);
