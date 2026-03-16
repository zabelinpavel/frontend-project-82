# Diff Finder

A CLI tool that compares two configuration files and shows the difference between them.

## Hexlet tests and linter status

[![Actions Status](https://github.com/zabelinpavel/frontend-project-82/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/zabelinpavel/frontend-project-82/actions)

[![CI](https://github.com/zabelinpavel/frontend-project-82/actions/workflows/ci.yml/badge.svg)](https://github.com/zabelinpavel/frontend-project-82/actions)

[![asciicast]](https://asciinema.org/a/KCrXtz5RRljjT1IM)

## Description

This utility compares two configuration files (JSON, YAML, or INI) and generates a formatted diff showing what has changed, been added, or been removed.

## Installation

```bash
npm install
```

## Usage

### CLI

```bash
gendiff <filepath1> <filepath2> [options]
```

**Options:**

- `-f, --format <type>` — Output format (default: `plain`)
  - `plain` — Human-readable plain text format
  - `stylish` — Pretty formatted output with colors
  - `json` — JSON format

**Examples:**

```bash
gendiff file1.json file2.json
gendiff file1.yaml file2.yml -f stylish
gendiff config1.json config2.json --format json
```

### As a Module

```javascript
import genDiff from '@hexlet/code';

const result = genDiff('file1.json', 'file2.json', 'stylish');
console.log(result);
```

## Supported Formats

- JSON
- YAML
- INI

## License

ISC

## Author

Zabelin Pavel
