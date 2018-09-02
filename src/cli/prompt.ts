import * as inquirer from 'inquirer'
import * as autocomplete from 'inquirer-autocomplete-prompt'
import * as fuzzy from 'fuzzy'
import { CommitMessage, CommitTypes } from '../lib/commitmsg'
import { formatHeader } from '../lib/formatmsg'
import { Config } from '../lib/config'

export const prompt = inquirer.createPromptModule()
prompt.registerPrompt('autocomplete', autocomplete)

// prettier-ignore
const enum PromptMessage {
  TYPE    = 'type:    ',
  SCOPE   = 'scope:   ',
  SUBJECT = 'subject: ',
  BODY    = 'body:    ',
  BREAK   = 'breaks:  ',
  ISSUE   = 'closes:  ',
  CONFIRM = 'commit?  ',
}

export async function promptHeader(
  message: CommitMessage = {},
  config?: Config
) {
  const answers = await prompt([
    {
      type: 'autocomplete',
      name: 'type',
      message: PromptMessage.TYPE,
      suggestOnly: false,
      source: async (answers, input) => {
        input = input || message.type || ''
        const results = fuzzy.filter(input, CommitTypes)
        const matches = results.map(el => el.original)
        return matches
      }
    } as inquirer.Question,
    {
      type: 'input',
      name: 'scope',
      message: PromptMessage.SCOPE,
      default: message.scope || undefined,
      filter: input => input.toLowerCase().trim(),
      transformer: input => input.toLowerCase(),
      validate: (input, answers) => {
        const isRequired = config && config.scope === 'required'
        if (isRequired && !input) {
          return 'scope is required'
        }
        return true
      },
      when: () => {
        return !(config && config.scope === 'none')
      }
    },
    {
      type: 'input',
      name: 'subject',
      message: PromptMessage.SUBJECT,
      default: message.subject || undefined,
      filter: input => input.toLowerCase().trim(),
      transformer: input => input.toLowerCase(),
      validate: (input, answers) => {
        if (!input) {
          return 'subject can not be empty'
        }
        const header = formatHeader(answers.type, answers.scope, input)
        if (header.length >= 72) {
          return 'subject is too long'
        }
        return true
      }
    }
  ])
  const { type, scope, subject } = answers
  message = Object.assign(message, { type, scope, subject })
  return message
}

export async function promptBody(lines: string[] = [], config?: Config) {
  const result: string[] = []
  for (let i = 0; i < 20; i++) {
    const answer = (await prompt([
      {
        type: 'input',
        name: 'body',
        message: PromptMessage.BODY,
        default: (lines && lines[i]) || undefined,
        filter: input => input.trim()
      }
    ])) as { body: string }
    const line = answer.body
    if (!line) break
    result.push(line)
  }
  return result
}

export async function promptBreakingChanges(line: string, config?: Config) {
  const answer = (await prompt([
    {
      type: 'input',
      name: 'breaking',
      message: PromptMessage.BREAK,
      default: line,
      filter: input => input.trim()
    }
  ])) as { breaking: string }
  return answer.breaking
}

export async function promptIssues(lines: string[] = [], config?: Config) {
  const result: string[] = []
  for (let i = 0; i < 20; i++) {
    const answer = (await prompt([
      {
        type: 'input',
        name: 'issue',
        message: PromptMessage.ISSUE,
        default: (lines && lines[i]) || undefined,
        filter: input => input.trim()
      }
    ])) as { issue: string }
    const line = answer.issue
    if (!line) break
    result.push(...line.split(/\s+|,|;/))
  }
  return result.filter(issue => !!issue)
}

export async function promptCommitMessage(
  message: CommitMessage = {},
  config?: Config
) {
  const header = await promptHeader(message, config)
  message = Object.assign(message, header)

  const body = await promptBody(message.body, config)
  message = Object.assign(message, { body })

  const breakingChanges = await promptBreakingChanges(message.breaking, config)
  message = Object.assign(message, { breakingChanges })

  const issues = await promptIssues(message.issues, config)
  message = Object.assign(message, { issues })

  return message
}

export async function promptConfirmCommit(config?: Config) {
  const answer = (await prompt([
    {
      type: 'confirm',
      name: 'commit',
      message: PromptMessage.CONFIRM,
      default: true
    }
  ])) as { commit: boolean }

  return answer.commit
}
