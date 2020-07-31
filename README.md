# Gendiff

[![Node CI](https://github.com/alexSmkh/gendiff/workflows/Node%20CI/badge.svg)](https://github.com/alexSmkh/gendiff/actions)
[![Maintainability](https://api.codeclimate.com/v1/badges/d82a95faac91e54bdedb/maintainability)](https://codeclimate.com/github/alexSmkh/gendiff/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/d82a95faac91e54bdedb/test_coverage)](https://codeclimate.com/github/alexSmkh/gendiff/test_coverage)

Compares two configuration files and shows a difference. The program supports three file formats: _json_, _yaml_ and _ini_.

### How to install

```bash
make install
make publish
npm  link
```

### How to run

```bash
gendiff --format [format] filepath1 filepath2
```

There are three types of output formats: [stylish(by default)](#stylish), [plain](#plain) and [JSON](#json)

#### Stylish:

[![asciicast](https://asciinema.org/a/iktoeYlaFTXrWYl0q0Ep6jOLe.svg)](https://asciinema.org/a/iktoeYlaFTXrWYl0q0Ep6jOLe)

#### Plain

[![asciicast](https://asciinema.org/a/P9y4oKhlf0E9F7t0XQWFamE9S.svg)](https://asciinema.org/a/P9y4oKhlf0E9F7t0XQWFamE9S)

#### JSON

[![asciicast](https://asciinema.org/a/1EnVwOp0F0qnmIVt2xsUe6Sxf.svg)](https://asciinema.org/a/1EnVwOp0F0qnmIVt2xsUe6Sxf)
