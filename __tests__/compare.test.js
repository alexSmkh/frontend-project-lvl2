/* eslint-disable no-underscore-dangle */
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import gendiff from '../src/index';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let beforeJsonPath;
let afterJsonPath;
let absolutePathForBeforeJson;
let absolutePathForAfterJson;
let beforeYamlPath;
let afterYamlPath;
let afterIniPath;
let beforeIniPath;
let result;
let nestedResult;
let stylishFormat;

beforeAll(() => {
  beforeJsonPath = '__fixtures__/nestedBefore.json';
  afterJsonPath = '__fixtures__/nestedAfter.json';
  beforeYamlPath = '__fixtures__/nestedBefore.yaml';
  afterYamlPath = '__fixtures__/nestedAfter.yaml';
  afterIniPath = '__fixtures__/after.ini';
  beforeIniPath = '__fixtures__/before.ini';
  absolutePathForBeforeJson = `${__dirname}/../${beforeJsonPath}`;
  absolutePathForAfterJson = `${__dirname}/../${afterJsonPath}`;
  nestedResult = fs.readFileSync('__fixtures__/resultForNested.txt', 'utf-8');
  result = fs.readFileSync('__fixtures__/result.txt', 'utf-8');
  stylishFormat = 'stylish';
});

test('comparing files with absolute paths', () => {
  expect(
    gendiff(absolutePathForBeforeJson, absolutePathForAfterJson, stylishFormat),
  ).toEqual(nestedResult);
});

test('comparing json/yaml/ini files', () => {
  expect(gendiff(beforeJsonPath, afterJsonPath, stylishFormat)).toEqual(nestedResult);
  expect(gendiff(beforeYamlPath, afterYamlPath, stylishFormat)).toEqual(nestedResult);
  expect(gendiff(beforeIniPath, afterIniPath, stylishFormat)).toEqual(result);
});
