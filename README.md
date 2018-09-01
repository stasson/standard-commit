# standard-commit

A friendly zero-config [conventional commit](https://conventionalcommits.org/) cli. Formats commit according to [standard-version](https://www.npmjs.com/package/standard-version).

> under dev...

## Usage

```bash
npm install -g standard-commit
```

```bash
# cli
standard-commit --help

# alias cc is also installed
git sc <option>
```

## Options

| short | long        | description                                                            |
| ----- | ----------- | ---------------------------------------------------------------------- |
| -a    | --all       | Tell the command to automatically stage files that have been modified. |
| -s    | --signoff   | Add Signed-off-by at the end of the commit log message.                |
| -n    | --no-verify | Bypasses the pre-commit and commit-msg hooks.                          |
| -e    | --edit      | further edit the message.                                              |

## Recommendations

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
