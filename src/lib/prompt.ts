import * as inquirer from 'inquirer'
import * as autocomplete from 'inquirer-autocomplete-prompt'
import * as fuzzy from 'fuzzy'
import { CommitMessage } from './commitmsg'
import { formatHeader } from './formatmsg'
import { Config, DefaultConfig } from './config'
import { suggestScopes } from './scopes'

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

export async function promptType(
  message: CommitMessage = {},
  config: Config = DefaultConfig
) {
  const { type } = await prompt([
    {
      type: 'autocomplete',
      name: 'type',
      message: PromptMessage.TYPE,
      suggestOnly: false,
      source: async (answers, input) => {
        input = input || message.type || ''
        const results = fuzzy.filter(input, config.types)
        const matches = results.map(el => el.original)
        return matches
      }
    } as inquirer.Question
  ])

  return Object.assign(message, { type })
}

export async function promptScope(
  scopes: string[],
  message: CommitMessage = {},
  config: Config = DefaultConfig
) {
  const scope = await prompt([
    {
      type: 'autocomplete',
      name: 'scope',
      message: PromptMessage.SCOPE,
      suggestOnly: config.scopes === 'suggest',
      source: async (answers, input) => {
        input = input || message.scope || ''
        const results = fuzzy.filter(input, scopes)
        const matches = results.map(el => el.original)
        return matches
      }
    } as inquirer.Question
  ])
  return Object.assign(message, { scope })
}

export async function promptSubject(
  message: CommitMessage = {},
  config: Config = DefaultConfig
) {
  const { subject } = (await prompt([
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
        const header = formatHeader(message.type, message.scope, input)
        if (header.length >= 72) {
          return 'subject is too long'
        }
        return true
      }
    }
  ])) as any
  return Object.assign(message, { subject })
}

export async function promptHeader(
  message: CommitMessage = {},
  config: Config = DefaultConfig
) {
  let scopeSuggestions

  const hasScope =
    config.scopes !== 'none' ||
    (Array.isArray(config.scopes) && config.scopes.length === 0)

  const suggestScope =
    hasScope && (config.scopes === 'suggest' || config.scopes === 'enforce')

  if (suggestScope) {
    scopeSuggestions = suggestScopes()
  }

  message = await promptType(message, config)

  if (hasScope) {
    const scopes: string[] = suggestScope
      ? await scopeSuggestions
      : config.scopes

    message = await promptScope(scopes, message, config)
  }

  message = await promptSubject(message, config)

  return message
}

export async function promptBody(
  lines: string[] = [],
  config: Config = DefaultConfig
) {
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

export async function promptBreakingChanges(
  line: string,
  config: Config = DefaultConfig
) {
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

export async function promptIssues(
  lines: string[] = [],
  config: Config = DefaultConfig
) {
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
  config: Config = DefaultConfig
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

export async function promptConfirmCommit(config: Config = DefaultConfig) {
  const answer = (await prompt([
    {
      type: 'expand',
      name: 'commit',
      message: PromptMessage.CONFIRM,
      default: 0,
      choices: [
        {
          key: 'y',
          name: 'Yes, do commit.',
          value: true
        },
        {
          key: 'n',
          name: 'No, abort commit!',
          value: false
        },
        {
          key: 'e',
          name: 'Edit commit message...',
          value: 'edit'
        }
      ]
    }
  ])) as { commit: boolean }

  return answer.commit as boolean | 'edit'
}
