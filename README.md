# standard-commit

Friendly zero-config [conventional commit](https://conventionalcommits.org/) cli. Formats commit according to [standard-version](https://www.npmjs.com/package/standard-version).

> under dev...

## Usage

```bash
npm install -g standard-commit
```

```bash
#
standard-commit <option>

#
git cc <options>
```

## Options

| short | long        | description                                                            |
| ----- | ----------- | ---------------------------------------------------------------------- |
| -a    | --all       | Tell the command to automatically stage files that have been modified. |
| -s    | --signoff   | Add Signed-off-by at the end of the commit log message.                |
| -n    | --no-verify | Bypasses the pre-commit and commit-msg hooks.                          |
| -e    | --edit      | further edit the message.                                              |
