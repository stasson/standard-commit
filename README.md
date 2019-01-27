# standard-commit

[![npm version](https://badge.fury.io/js/standard-commit.svg)](https://badge.fury.io/js/standard-commit)

A zero-config opiniated, [commitizen](https://github.com/commitizen/cz-cli)
like command line utility to enforce the
[conventional commits](https://conventionalcommits.org/) and have a clean
changelog with
[standard-version](https://github.com/conventional-changelog/standard-version).

- **standard-commit**: Same as `git commit` but with prompt and formating of the
  commit message.

- **standard-commitlint** runs
  [commitlint](https://github.com/marionebl/commitlint) based on your
  standard-commit config.

- **standard-commithook** is meant to be run as a `commit-msg` git hook to
  enforce the convention.

## Usage

```bash
npm install -g standard-commit
```

```bash
standard-commit --help
```

### git alias

```bash
# you can create an alias:
git config --global alias.cc '!standard-commit'
# then use:
git cc <option>
```

### commitlint

```bash
# Usage: standard-commitlint [options...]
# Where <options> is one of:
#   -f --from  lower end of the commit range to lint.
#   -t --to    upper end of the commit range to lint.
standard-commitlint --help
```

### ci checks

```bash
# CI check before merge request
npx -p standard-commit standard-commitlint --from origin/master
```

### repo setup

install yorkie (or husky@next)

```bash
npm install --save-dev yorkie standard-commit standard-version
```

and setup the scripts and commit-msg hook in your _package.json_

```json
{
  "scripts": {
    "commit": "standard-commit",
    "commitlint": "standard-commitlint",
    "release": "standard-version"
  },
  "gitHooks": {
    "commit-msg": "standard-commithook"
  }
}
```

```bash
# use commit script to commit
npm -s run commit

# use commitlint script to check commit history
npm -s run commitlint -- --from  origin/master

# use release script to create a version commit
npm -s run release
```

## Configuration

you can configure standard-commit via:

- A `.standard-commitrc` file, written in YAML or JSON, with optional
  extensions: .yaml/.yml/.json.
- A `standard-commit.config.js` file that exports an object.
- A `standard-commit` key in your package.json file.

```ts
{
  /**
   * Allowed types
   *
   * @default ['feat','fix','chore','docs','style','refactor','test',...]
   */
  types?: string[]

  /**
   * When set to 'staged', suggest from staged files (git).
   * When set to 'packages, suggest from package names (monorepo).
   * When set to an array, the list of scopes.
   *
   * @default 'staged'
   */
  scopes?: 'staged' | 'packages' | string[]

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
