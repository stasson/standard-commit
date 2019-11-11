import { validateSubject, loadConfig } from '../lib'
import { valid } from 'semver'

describe('validateSubject', () => {
  it('should be valid', async () => {
    const config = await loadConfig()
    const valid = validateSubject('hello')
    expect(valid).toEqual(true)
  })
  it('should be invalid', async () => {
    const config = await loadConfig()
    const valid = validateSubject('hello.')
    expect(typeof valid).toEqual('string')
  })
  it('should be invalid', async () => {
    const config = await loadConfig()
    const valid = validateSubject('Hello')
    expect(typeof valid).toEqual('string')
  })
})
