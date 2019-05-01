import { loadConfig } from '../lib'

describe('config', () => {
  it('loads default config', async () => {
    expect.hasAssertions()
    const config = await loadConfig()
    expect(config).toMatchInlineSnapshot(`
      Object {
        "promptBody": true,
        "promptBreaking": true,
        "promptConfirm": true,
        "promptIssues": true,
        "promptScope": "enforce",
        "scopes": "staged",
      }
    `)
  })
})
