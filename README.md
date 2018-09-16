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

# you can create an alias:
git config --global alias.cc '!standard-commit'
# then use:
git cc <option>
```

## Options

| short | long        | description                                        |
| ----- | ----------- | -------------------------------------------------- |
| -a    | --all       | Automatically stage files that have been modified. |
| -s    | --signoff   | Add Signed-off-by.                                 |
| -n    | --no-verify | Bypasses the commit hooks.                         |
| -e    | --edit      | further edit the message.                          |

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
   * @default [ 'feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore' ]
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

  /**
   * extra commitlint rules
   *
   * see http://marionebl.github.io/commitlint/#/reference-rules
   */
  rules?: {}
}
```

## commitlint

standard-commit comes bundled with [commitlint](https://github.com/marionebl/commitlint)

```bash
  standard-commitlint

  Usage: standard-commitlint [options...]

  Where <options> is one of:

    -f --from
    lower end of the commit range to lint.

    -t --to
    upper end of the commit range to lint.

  Exemple:

    standard-commitlint --from origin/master
```

### ci checks

```bash
npx -p standard-commit standard-commitlint --from origin/master
```

### commit-msg hook

the `standard-commit-msg-hook` bin can be used as a pre-commit hook:

install yorkie (or husky@^1.0.0-rc14)

```bash
npm install --save-dev yorkie standard-commit
```

and setup the commit-msg hook in your _package.json_

```json
{
  "gitHooks": {
    "commit-msg": "standard-commit-msg-hook"
  }
}
```

## Other usefull packages

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
