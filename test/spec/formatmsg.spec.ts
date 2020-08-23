import { formatMessage } from '../lib'

const loreipsum =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'

describe('formatMessage', () => {
  it('formats header', () => {
    expect(
      formatMessage({
        type: 'type',
        subject: 'subject',
      })
    ).toMatchInlineSnapshot(`
      "type: subject
      "
    `)
  })

  it('formats scoped header', () => {
    expect(
      formatMessage({
        type: 'type',
        scope: 'scope',
        subject: 'subject',
      })
    ).toMatchInlineSnapshot(`
      "type(scope): subject
      "
    `)
  })

  it('formats body', () => {
    expect(
      formatMessage({
        type: 'type',
        scope: 'scope',
        subject: 'subject',
        body: ['lore ipsum:', loreipsum],
      })
    ).toMatchInlineSnapshot(`
      "type(scope): subject

      lore ipsum:
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
      velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
      occaecat cupidatat non proident, sunt in culpa qui officia deserunt
      mollit anim id est laborum.
      "
    `)
  })

  it('formats breaking change', () => {
    expect(
      formatMessage({
        type: 'type',
        scope: 'scope',
        subject: 'subject',
        breaking: 'a breaking change',
      })
    ).toMatchInlineSnapshot(`
      "type(scope): subject

      BREAKING CHANGE: a breaking change
      "
    `)
  })

  it('formats issues', () => {
    expect(
      formatMessage({
        type: 'fix',
        scope: 'scope',
        subject: 'subject',
        issues: ['#1', '2'],
      })
    ).toMatchInlineSnapshot(`
      "fix(scope): subject

      Fixes #1, #2
      "
    `)

    expect(
      formatMessage({
        type: 'feat',
        scope: 'scope',
        subject: 'subject',
        issues: ['#1', '2'],
      })
    ).toMatchInlineSnapshot(`
      "feat(scope): subject

      Closes #1, #2
      "
    `)
  })

  it('formats all', () => {
    expect(
      formatMessage({
        type: 'feat',
        scope: 'scope',
        subject: 'subject',
        body: ['description of the change'],
        breaking: 'this is a breaking change',
        issues: ['#1', '2'],
      })
    ).toMatchInlineSnapshot(`
      "feat(scope): subject

      description of the change

      BREAKING CHANGE: this is a breaking change

      Closes #1, #2
      "
    `)

    expect(
      formatMessage({
        type: 'feat',
        scope: 'scope',
        subject: 'subject',
        body: ['description of the change'],
        breaking: 'this is a breaking change',
        issues: [],
      })
    ).toMatchInlineSnapshot(`
      "feat(scope): subject

      description of the change

      BREAKING CHANGE: this is a breaking change
      "
    `)
  })
})
