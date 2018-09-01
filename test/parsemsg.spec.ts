import { parseCommitMessage } from './lib'

const conventional = {
  // 'Commit message with description and breaking change in body
  breaking: `feat: allow provided config object to extend other configs

BREAKING CHANGE: \`extends\` key in config file is now used for extending other config files
`,

  //Commit message with no body
  header: `docs: correct spelling of CHANGELOG
`,

  //Commit message with scope
  scoped: `feat(lang): add polish language`,

  //Commit message for a fix using an (optional) issue number.
  fix: `fix: correct minor typos in code

see the issue for details on the typos fixed

fixes issue #12
`,

  multiline: `fix: chore

a multiline 
description 
block

another information

BREAKING CHANGE: a breaking change

closes #34
fixes #38    
  `
}

const unconventional = {
  message: ` hello world fails launching
  
  compile for right target
  
  `
}

describe('parseCommitMessage', () => {
  describe('conventional commit', () => {
    it('has type and subject', () => {
      for (let key in conventional) {
        let msg = conventional[key]
        const commit = parseCommitMessage(msg)
        expect(commit.type).toBeDefined()
        expect(commit.subject).toBeDefined()
      }
    })

    it('may have scope', () => {
      const commit = parseCommitMessage(conventional.scoped)
      expect(commit.scope).toBeDefined()
      expect(commit.scope).toEqual('lang')
    })

    it('may not have scope', () => {
      const commit = parseCommitMessage(conventional.fix)
      expect(commit.scope).not.toBeDefined()
    })

    it('may heave a body', () => {
      const commit = parseCommitMessage(conventional.multiline)
      expect(commit.body).toBeDefined()
      expect(commit.body).toEqual([
        'a multiline description block',
        'another information'
      ])
    })

    it('may have no a body', () => {
      const commit = parseCommitMessage(conventional.header)
      expect(commit.body).not.toBeDefined()
    })

    it('may have breaking changes', () => {
      const commit = parseCommitMessage(conventional.multiline)
      expect(commit.breaking).toBeDefined()
      expect(commit.breaking).toEqual('a breaking change')
    })

    it('may have no breaking changes', () => {
      const commit = parseCommitMessage(conventional.header)
      expect(commit.breaking).not.toBeDefined()
    })

    it('may have issues', () => {
      const commit = parseCommitMessage(conventional.multiline)
      expect(commit.issues).toBeDefined()
      expect(commit.issues).toEqual(['#34', '#38'])
    })

    it('may have no issues', () => {
      const commit = parseCommitMessage(conventional.header)
      expect(commit.issues).not.toBeDefined()
    })
  })

  describe('unconventional commit', () => {
    it('has a subject', () => {
      const commit = parseCommitMessage(unconventional.message)
      expect(commit.subject).toBeDefined()
    })

    it('type is undefined when not provided', () => {
      const commit = parseCommitMessage(unconventional.message)
      expect(commit.type).not.toBeDefined()
    })
  })
})
