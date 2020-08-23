jest.mock('../../src/lib/scopes')
import {
  promptConfirmCommit,
  promptSubject,
  promptType,
  promptScope,
  promptHeader,
  promptCommitMessage,
  suggestScopes,
} from '../lib'
import stdin from 'bdd-stdin'

const scopes = suggestScopes as any
scopes.mockImplementation(async () => {
  return ['scope', 'other']
})

describe('prompt', () => {
  describe('promptConfirmCommit', () => {
    it('accepts enter as an answer', async () => {
      expect.hasAssertions()
      stdin('\n')
      const result = await promptConfirmCommit()
      expect(result).toEqual(true)
    })

    it('accepts yes as an answer', async () => {
      expect.hasAssertions()
      stdin('y', '\n')
      const result = await promptConfirmCommit()
      expect(result).toEqual(true)
    })

    it('accepts no as an answer', async () => {
      expect.hasAssertions()
      stdin('n', '\n')
      const result = await promptConfirmCommit()
      expect(result).toEqual(false)
    })

    describe('promptType', () => {
      it('accepts feat as an answer', async () => {
        expect.hasAssertions()
        stdin('feat', '\n')
        const { type } = await promptType()
        expect(type).toEqual('feat')
      })

      it('to return feat by default', async () => {
        expect.hasAssertions()
        stdin('\n')
        const { type } = await promptType()
        expect(type).toEqual('feat')
      })
    })
  })

  describe('promptSubject', () => {
    it('accepts answers', async () => {
      expect.hasAssertions()
      stdin(' a valid subject ', '\n')
      const { subject } = await promptSubject()
      expect(subject).toEqual('a valid subject')
    })
  })

  describe('promptScope', () => {
    it('accepts answers', async () => {
      expect.hasAssertions()
      stdin('\n')
      const { scope } = await promptScope(['scope'])
      expect(scope).toEqual('scope')
    })
  })

  describe('promptHeader', () => {
    it('accepts answers', async () => {
      expect.hasAssertions()
      stdin('feat', '\n', 'subject', '\n')
      const message = await promptHeader()
      expect(message).toMatchInlineSnapshot(`
                Object {
                  "subject": "subject",
                  "type": "feat",
                }
            `)
    })
  })

  describe('promptMessage', () => {
    it('accepts answers', async () => {
      expect.hasAssertions()
      stdin(
        'feat',
        '\n',
        'subject',
        '\n',
        'body',
        '\n',
        '\n',
        'breaking',
        '\n',
        '\n',
        'issue',
        '\n',
        '\n'
      )
      const message = await promptCommitMessage()
      expect(message).toMatchInlineSnapshot(`
                Object {
                  "body": Array [
                    "body",
                  ],
                  "breaking": "breaking",
                  "issues": Array [],
                  "subject": "subject",
                  "type": "feat",
                }
            `)
    })

    it('accepts quick answers', async () => {
      expect.hasAssertions()
      stdin('\n', 'subject', '\n', '\n', '\n', '\n')
      const message = await promptCommitMessage()
      expect(message).toMatchInlineSnapshot(`
        Object {
          "body": Array [],
          "breaking": "",
          "issues": Array [],
          "subject": "subject",
          "type": "feat",
        }
      `)
    })
  })
})
