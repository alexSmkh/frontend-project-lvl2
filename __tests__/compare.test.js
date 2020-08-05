/* eslint-disable no-underscore-dangle */
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import gendiff from '../src/index';

const fileFormats = ['json', 'yaml', 'ini'];
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturePath = (filename) => join(__dirname, '__fixtures__', filename);

describe('Comparing json/yaml/ini files', () => {
  test.each(fileFormats)('Test for the stylish format. Compare %s files.', (fileFormat) => {
    const stylishResult = fs.readFileSync(getFixturePath('stylishResult.txt'), 'utf-8');
    const pathToFixtureBefore = getFixturePath(`before.${fileFormat}`);
    const pathToFixtureAfter = getFixturePath(`after.${fileFormat}`);
    expect(gendiff(pathToFixtureBefore, pathToFixtureAfter, 'stylish')).toEqual(stylishResult);
  });

  test.each(fileFormats)('Compare %s files. Test for the plain format', (fileFormat) => {
    const plainResult = fs.readFileSync(getFixturePath('plainResult.txt'), 'utf-8');
    const pathToFixtureBefore = getFixturePath(`before.${fileFormat}`);
    const pathToFixtureAfter = getFixturePath(`after.${fileFormat}`);
    expect(gendiff(pathToFixtureBefore, pathToFixtureAfter, 'plain')).toEqual(plainResult);
  });
});
