/* eslint-disable no-underscore-dangle */
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import gendiff from '../src/index';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let plainResult;
let stylishResult;
let formats;
let beforeAfterFixtures;

beforeAll(() => {
  stylishResult = fs.readFileSync(`${__dirname}/__fixtures__/stylishResult.txt`, 'utf-8');
  plainResult = fs.readFileSync(`${__dirname}/__fixtures__/plainResult.txt`, 'utf-8');
  formats = ['json', 'yaml', 'ini'];
  beforeAfterFixtures = formats.map((format) => [`${__dirname}/__fixtures__/before.${format}`, `${__dirname}/__fixtures__/after.${format}`]);
});

describe('Comparing json/yaml/ini files', () => {
  test('Test for the stylish format', () => {
    beforeAfterFixtures.forEach(([before, after]) => expect(gendiff(before, after, 'stylish')).toEqual(stylishResult));
  });

  test('Test for the plain format', () => {
    beforeAfterFixtures.forEach(([before, after]) => expect(gendiff(before, after, 'plain')).toEqual(plainResult));
  });
});
