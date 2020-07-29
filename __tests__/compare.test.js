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
let plainFormat;
let stylishFormat;
let plainResult;
let stylishResult;
let nestedStylishResult;
let nestedPlainResult;

beforeAll(() => {
  beforeJsonPath = '__fixtures__/nestedBefore.json';
  afterJsonPath = '__fixtures__/nestedAfter.json';
  beforeYamlPath = '__fixtures__/nestedBefore.yaml';
  afterYamlPath = '__fixtures__/nestedAfter.yaml';
  afterIniPath = '__fixtures__/after.ini';
  beforeIniPath = '__fixtures__/before.ini';
  absolutePathForBeforeJson = `${__dirname}/../${beforeJsonPath}`;
  absolutePathForAfterJson = `${__dirname}/../${afterJsonPath}`;
  plainFormat = 'plain';
  stylishFormat = 'stylish';
  nestedStylishResult = fs.readFileSync('__fixtures__/nestedStylishResult.txt', 'utf-8');
  nestedPlainResult = fs.readFileSync('__fixtures__/nestedPlainResult.txt', 'utf-8');
  plainResult = fs.readFileSync('__fixtures__/plainResult.txt', 'utf-8');
  stylishResult = fs.readFileSync('__fixtures__/stylishResult.txt', 'utf-8');
});

describe('test for the stylish format', () => {
  test('comparing files with absolute paths', () => {
    expect(
      gendiff(absolutePathForBeforeJson, absolutePathForAfterJson, stylishFormat),
    ).toEqual(nestedStylishResult);
  });

  test('comparing json/yaml/ini files', () => {
    expect(gendiff(beforeJsonPath, afterJsonPath, stylishFormat)).toEqual(nestedStylishResult);
    expect(gendiff(beforeYamlPath, afterYamlPath, stylishFormat)).toEqual(nestedStylishResult);
    expect(gendiff(beforeIniPath, afterIniPath, stylishFormat)).toEqual(stylishResult);
  });
});

// describe('test for the plain format' () => {

// });

// test('comparing files with absolute paths', () => {
//   expect(
//     gendiff(absolutePathForBeforeJson, absolutePathForAfterJson, stylishFormat),
//   ).toEqual(nestedStylishResult);
// });

// test('comparing json/yaml/ini files (stylish format)', () => {
//   expect(gendiff(beforeJsonPath, afterJsonPath, stylishFormat)).toEqual(nestedStylishResult);
//   expect(gendiff(beforeYamlPath, afterYamlPath, stylishFormat)).toEqual(nestedStylishResult);
//   expect(gendiff(beforeIniPath, afterIniPath, stylishFormat)).toEqual(result);
// });

// test('comparing');
