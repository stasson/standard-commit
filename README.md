# standard-commit

[![npm version](https://badge.fury.io/js/standard-commit.svg)](https://badge.fury.io/js/standard-commit)

A no-brainer zero-config [conventional commit](https://conventionalcommits.org/) command line.

Formats commit according to [standard-version](https://www.npmjs.com/package/standard-version).

> under dev...

## Usage

```bash
npm install -g standard-commit
```

```bash
# cli
standard-commit --help

# alias git-cc is also installed
git cc <option>
```

## Options

| short | long        | description                                                            |
| ----- | ----------- | ---------------------------------------------------------------------- |
| -a    | --all       | Tell the command to automatically stage files that have been modified. |
| -s    | --signoff   | Add Signed-off-by at the end of the commit log message.                |
| -n    | --no-verify | Bypasses the pre-commit and commit-msg hooks.                          |
| -e    | --edit      | further edit the message.                                              |

## Configuration File

you can configure prettier via:

- A `.standard-commitrc` file, written in YAML or JSON, with optional extensions: .yaml/.yml/.json.
- A `standard-commit.config.js` file that exports an object.
- A `standard-commit` key in your package.json file.

```ts
{
  /**
   * Allowed types
   *
   * @default [ 'feat', 'fix', 'docs', 'refactor', 'chore' ...]
   */
  types?: string[]

  /**
   * Allowed scopes
   *
   * @default undefined
   */
  scopes?: string[]

  /**
   * When set to 'suggest', scope is optional.
   * When set to 'enforce, scope can not be empty.
   * When set to false, scope prompt is skipped.
   * @default 'suggest'
   */
  promptScope?: 'suggest' | 'enforce' | false

  /**
   * set to false to skip.
   *
   * @default true
   */
  promptBody?: boolean

  /**
   * set to false to skip.
   *
   * @default true
   */
  promptBreaking?: boolean

  /**
   * set to false to skip.
   *
   * @default true
   */
  promptIssues?: boolean

  /**
   * set to false to skip.
   *
   * @default true
   */
  promptConfirm?: boolean
}
```

## Other usefull packages

### commitlint

> use commit hooks to trigger [commitlint](https://github.com/marionebl/commitlint) and validate the commit message.

```bash
npm install --save-dev yorkie @commitlint/cli commitlint/config-conventional
```

```json
{
  // package.json
  "commitlint": {
    "extends": ["@commitlint/config-conventional"]
  },
  "gitHooks": {
    "commit-msg": "commitlint -E GIT_PARAMS"
  }
}
```

### standard-version

> [standard-version](https://www.npmjs.com/package/standard-version) creates a release commit with bumped version and updated changelog

```bash
npm install --save-dev standard-version
```

```json
{
  // package.json
  "scripts": {
    "release": "standard-version"
  }
}
```

### commitizen

standard-commit is highly inspired by the [commitizen](https://github.com/commitizen/cz-cli) command line utility, which is configurable.
