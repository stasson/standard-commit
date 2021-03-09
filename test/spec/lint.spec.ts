import { commitLint } from '../lib'

describe('commitLint', () => {
  it('lint error', async () => {
    const result = await commitLint('invalid message')
    expect(result.valid).toBeFalsy()
  })

  it('lint success', async () => {
    const result = await commitLint('feat: valid message')
    expect(result.valid).toBeTruthy()
  })

  it('lint refs', async () => {
    const result = await commitLint(
      `fix: valid message
      
      Refs: #123
      Closes: PROJ-123
      Close: #123
      Fix: PROJ-123
      Fixes: #123
      `
    )
    expect(result.valid).toBeTruthy()
  })

  it('lint invalid scope', async () => {
    const { valid } = await commitLint('feat: valid message', {
      promptScope: 'enforce',
    })
    expect(valid).toBeFalsy()
  })

  it('lint valid scope', async () => {
    const { valid } = await commitLint('feat(a-scope): valid message', {
      promptScope: 'enforce',
    })
    expect(valid).toBeTruthy()
  })
})
