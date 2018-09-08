import { loadConfig } from './lib'

describe('config', () => {
  it('loads default config', async () => {
    expect.hasAssertions()
    const config = await loadConfig()
    expect(config).toMatchInlineSnapshot(`
Object {
  "scopes": "none",
}
`)
  })
})
