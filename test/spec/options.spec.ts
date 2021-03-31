import { loadOptions } from '../lib'

describe('loadOptions', () => {
  it('loads ', async () => {
    expect.hasAssertions()
    const options = await loadOptions()
    expect(options).toMatchInlineSnapshot(`
      Object {
        "defaultIgnores": undefined,
        "extends": Array [],
        "formatter": "@commitlint/format",
        "helpUrl": "https://github.com/conventional-changelog/commitlint/#what-is-commitlint",
        "ignores": undefined,
        "parserPreset": undefined,
        "plugins": Object {
          "localPlugin": Object {
            "rules": Object {
              "references-empty-enum": [Function],
            },
          },
        },
        "rules": Object {
          "body-leading-blank": Array [
            1,
            "always",
          ],
          "body-max-line-length": Array [
            2,
            "always",
            100,
          ],
          "footer-leading-blank": Array [
            1,
            "always",
          ],
          "footer-max-line-length": Array [
            2,
            "always",
            100,
          ],
          "header-max-length": Array [
            2,
            "always",
            100,
          ],
          "scope-case": Array [
            2,
            "always",
            "lower-case",
          ],
          "scope-empty": Array [
            2,
            "always",
          ],
          "subject-case": Array [
            2,
            "never",
            Array [
              "sentence-case",
              "start-case",
              "pascal-case",
              "upper-case",
            ],
          ],
          "subject-empty": Array [
            2,
            "never",
          ],
          "subject-full-stop": Array [
            2,
            "never",
            ".",
          ],
          "type-case": Array [
            2,
            "always",
            "lower-case",
          ],
          "type-empty": Array [
            2,
            "never",
          ],
          "type-enum": Array [
            2,
            "always",
            Array [
              "feat",
              "fix",
              "chore",
              "docs",
              "style",
              "refactor",
              "test",
            ],
          ],
        },
      }
    `)
  })
})
