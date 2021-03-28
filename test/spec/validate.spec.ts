import { validateSubject, loadConfig } from '../lib'
import { valid } from 'semver'
import { loadOptions } from '../../src'

describe('validateSubject', () => {
  it('should be valid', async () => {
    const config = await loadConfig()
    const { rules } = await loadOptions(config)
    const valid = validateSubject('hello', rules)
    expect(valid).toEqual(true)
  })
  it('should be invalid', async () => {
    const config = await loadConfig()
    const { rules } = await loadOptions(config)
    const valid = validateSubject('hello.', rules)
    expect(typeof valid).toEqual('string')
  })
  it('should be invalid', async () => {
    const config = await loadConfig()
    const { rules } = await loadOptions(config)
    const valid = validateSubject('Hello', rules)
    expect(typeof valid).toEqual('string')
  })
})
