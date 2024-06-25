import { commitLint } from '../lib'

describe('commitLint', () => {
  it('lint ', async () => {
    const result = await commitLint(
      `fix: valid message` +
        `
this is a body 

BREAKING_CHANGE: this is breaks it
# this is a very long comment ---------------------------------------------------------------------------------------

Refs: #123
Closes: PROJ-123
Close: #123
Fix: PROJ-123
Fixes: #123
`
    )
    expect(result.valid).toBeTruthy()
  })

  it('lint fails for invalid messages', async () => {
    const result = await commitLint('invalid message')
    expect(result.valid).toBeFalsy()
  })

  it('lint passes for valid messages', async () => {
    const result = await commitLint('feat: valid message')
    expect(result.valid).toBeTruthy()
  })

  it('lint fails for invalid scope', async () => {
    const { valid } = await commitLint('feat: valid message', {
      promptScope: 'enforce',
    })
    expect(valid).toBeFalsy()
  })

  it('lint passes for valid scope', async () => {
    const { valid } = await commitLint('feat(a-scope): valid message', {
      promptScope: 'enforce',
    })
    expect(valid).toBeTruthy()
  })

  it('lint fails for missing signed-by-off', async () => {
    const { valid, errors } = await commitLint('feat: valid message', {
      enforceSignedOffBy: true,
    })
    expect(valid).toBeFalsy()
  })

  it('lint fails for missing signed-by-off', async () => {
    const { valid } = await commitLint(
      `feat: valid message` +
        `

Signed-off-by: Humpty Dumpty <humpty.dumpty@example.com>`,
      {
        enforceSignedOffBy: true,
      }
    )
    expect(valid).toBeTruthy()
  })

  it('lint fails for missing refs', async () => {
    const { valid, input, errors } = await commitLint(`feat: valid message`, {
      enforceIssueRefs: true,
    })

    expect(valid).toBeFalsy()
  })

  it('lint fails for missing prefixed refs', async () => {
    const { valid, input, errors } = await commitLint(
      `feat: valid message` +
        `

Refs: #123`,
      {
        enforceIssueRefs: true,
        issuePrefixes: ['PROJ-'],
      }
    )

    expect(valid).toBeFalsy()
  })

  it('lint fails for valid prefixed refs', async () => {
    const { valid, input, errors } = await commitLint(
      `feat: valid message` +
        `

Refs: PROJ-123`,
      {
        enforceIssueRefs: true,
        issuePrefixes: ['PROJ-'],
      }
    )

    expect(valid).toBeTruthy()
  })

  it('lint passes when enforced refs', async () => {
    const { valid, input, errors } = await commitLint(
      `feat: valid message` +
        `

Refs: #123`,
      {
        enforceIssueRefs: true,
      }
    )
    expect(valid).toBeTruthy()
  })

  it('lint passes when enforced feat refs', async () => {
    const { valid, input, errors } = await commitLint(
      `feat: valid message` +
        `

Closes: #123`,
      {
        enforceIssueRefs: ['feat'],
      }
    )
    expect(valid).toBeTruthy()
  })

  it('lint pass when missing feat refs', async () => {
    const { valid, input, errors } = await commitLint(`feat: valid message`, {
      enforceIssueRefs: ['fix'],
    })
    expect(valid).toBeTruthy()
  })

  it('lint fail when missing feat refs', async () => {
    const { valid, input, errors } = await commitLint(`feat: valid message`, {
      enforceIssueRefs: ['feat'],
    })
    expect(valid).toBeFalsy()
  })
})
