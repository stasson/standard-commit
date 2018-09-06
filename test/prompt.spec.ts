import { promptType } from './lib'
import * as stdin from 'bdd-stdin'
import { promptConfirmCommit, promptHeader, DefaultConfig, promptSubject } from '../src'

describe('prompt', () => {
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

    it('accepts yes as an answer', async () => {
      expect.hasAssertions()
      stdin('n', '\n')
      const result = await promptConfirmCommit()
      expect(result).toEqual(false)
    })

    it('accepts edit as an answer', async () => {
      expect.hasAssertions()
      stdin('e', '\n')
      const result = await promptConfirmCommit()
      expect(result).toEqual('edit')
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
})
