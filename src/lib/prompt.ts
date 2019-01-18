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
  if (scopes && scopes.length) {
    const { scope } = await prompt([
      {
        type: 'autocomplete',
        name: 'scope',
        message: PromptMessage.SCOPE,
        suggestOnly: config.promptScope === 'suggest',
        source: async (answers, input) => {
          input = input || message.scope || ''
          const results = fuzzy.filter(input, scopes)
          const matches = results.map(el => el.original)
          return matches
        }
      } as inquirer.Question
    ])
    return Object.assign(message, { scope })
  } else {
    const { scope } = (await prompt([
      {
        type: 'input',
        name: 'scope',
        message: PromptMessage.SCOPE,
        default: message.scope || undefined,
        validate: (input, answers) => {
          if (!input && config.promptScope === 'enforce') {
            return 'scope can not be empty'
          }
          return true
        }
      }
    ])) as any
    return Object.assign(message, { scope })
  }
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
  const getscopes = suggestScopes(config)
  message = await promptType(message, config)
  const scopes = await getscopes

  if (!!config.promptScope) {
    message = await promptScope(scopes, message, config)
  }

  message = await promptSubject(message, config)

  return message
}

export async function promptBody(
  message: CommitMessage = {},
  config: Config = DefaultConfig
) {
  const lines = message.body || []
  const body: string[] = []
  for (let i = 0; i < 20; i++) {
    const { line } = (await prompt([
      {
        type: 'input',
        name: 'line',
        message: PromptMessage.BODY,
        default: (lines && lines[i]) || undefined,
        filter: input => input.trim()
      }
    ])) as { line }

    if (!line) break
    body.push(line)
  }

  return Object.assign(message, { body })
}

export async function promptBreakingChanges(
  message: CommitMessage = {},
  config: Config = DefaultConfig
) {
  const { breaking } = (await prompt([
    {
      type: 'input',
      name: 'breaking',
      message: PromptMessage.BREAK,
      default: message.breaking || undefined,
      filter: input => input.trim()
    }
  ])) as { breaking: string }
  return Object.assign(message, { breaking })
}

export async function promptIssues(
  message: CommitMessage = {},
  config: Config = DefaultConfig
) {
  const lines = message.issues || []

  const result: string[] = []
  for (let i = 0; i < 20; i++) {
    const { issue } = (await prompt([
      {
        type: 'input',
        name: 'issue',
        message: PromptMessage.ISSUE,
        default: (lines && lines[i]) || undefined,
        filter: input => input.trim()
      }
    ])) as { issue: string }
    if (!issue) break
    result.push(...issue.split(/\s+|,|;/))
  }
  const issues = result.filter(issue => !!issue)
  return Object.assign(message, { issues })
}

export async function promptCommitMessage(
  message: CommitMessage = {},
  config: Config = DefaultConfig
) {
  const header = await promptHeader(message, config)
  message = Object.assign(message, header)

  if (config.promptBody) {
    message = await promptBody(message, config)
  }

  if (config.promptBreaking) {
    message = await promptBreakingChanges(message, config)
  }

  if (config.promptIssues) {
    message = await promptIssues(message, config)
  }
  return message
}

export async function promptConfirmCommit(config: Config = DefaultConfig) {
  if (!config.promptConfirm) return true
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
