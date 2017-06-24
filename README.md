# run-bin - Launch `node_modules/.bin` scripts in parent projects

## Overview

Designed for use in **monorepos** where your devDependencies are installed in
a parent directory to your individual packages.

Allows you run tools in `node_modules/.bin` in the parent project (such
as the typescript compiler or mocha) without having to install them globally
or for each individual package.

## Usage

For each individual package in your monorepo, add `run-bin` as a devDependency

```bash
npm install --save-dev run-bin
```

Then simply add `run-bin` to the start of your script definitions in
`package.json` to allow them to utilise devDependencies installed at the
top-level of youe monorepo (or any node_modules folder above that!)

```json
  "scripts": {
    "build": "run-bin tsc",
    "test": "run-bin mocha"
  }
```

This package also includes the functionality available in `cross-env` so you
can also pass environment variables to your processes as shown below:

```json
  "scripts": {
    "build": "run-bin NODE_ENV=production webpack",
  }
```

## Acknowledgements

Based on the awesome work by these fine folks:

 * [Kent C. Dodds: cross-env](https://github.com/kentcdodds/cross-env)

## Related Projects

 * [subpackage](https://github.com/dupski/subpackage)

## License

MIT
