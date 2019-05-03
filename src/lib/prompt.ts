import { CommitMessage } from './commitmsg'
import { formatHeader, formatMessage } from './formatmsg'
import { Config, DefaultConfig } from './config'
import { suggestScopes } from './scopes'
import { prompt } from 'enquirer'

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
  const { type } = await prompt({
    type: 'autocomplete',
    name: 'type',
    message: PromptMessage.TYPE,
    choices: config.types,
    initial: message.type
  })
  return Object.assign(message, { type })
}

export async function promptScope(
  scopes: string[],
  message: CommitMessage = {},
  config: Config = DefaultConfig
) {
  if (scopes && scopes.length) {
    if (config.promptScope == 'enforce') {
      // enforce suggestions
      const { scope } = await prompt({
        type: 'autocomplete',
        name: 'scope',
        message: PromptMessage.SCOPE,
        choices: scopes,
        initial: message.scope
      })
      return Object.assign(message, { scope })
    } else {
      // with suggestions
      const { scope } = await prompt({
        type: 'autocomplete',
        name: 'scope',
        message: PromptMessage.SCOPE,
        choices: ['none', ...scopes],
        initial: message.scope,
        maxChoices: 4,
        result: v => (v == 'none' ? undefined : v),
        format: v => (v == 'none' ? '' : v)
      })
      return Object.assign(message, { scope })
    }
  } else {
    // no suggestions
    const { scope } = await prompt({
      type: 'input',
      name: 'scope',
      message: PromptMessage.SCOPE,
      initial: message.scope,
      required: false,
      format: x => x.toLowerCase(),
      result: x => x.toLowerCase().trim()
    })
    return Object.assign(message, { scope })
  }
}

export async function promptSubject(
  message: CommitMessage = {},
  config: Config = DefaultConfig
) {
  const { subject } = await prompt({
    type: 'input',
    name: 'subject',
    message: PromptMessage.SUBJECT,
    initial: message.subject,
    validate: input => {
      if (!input) {
        return 'subject can not be empty'
      }
      const header = formatHeader(message.type, message.scope, input)
      if (header.length >= 72) {
        return 'subject is too long'
      }
      return true
    },
    format: x => x.toLowerCase(),
    result: x => x.toLowerCase().trim()
  })
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
    const initial =
      message.body && i < message.body.length ? message.body[i] : undefined
    const { line } = await prompt({
      type: 'input',
      name: 'line',
      message: PromptMessage.BODY,
      required: false,
      result: x => x.trim(),
      initial
    })
    if (!line.trim()) break
    body.push(line)
  }

  return Object.assign(message, { body })
}

export async function promptBreakingChanges(
  message: CommitMessage = {},
  config: Config = DefaultConfig
) {
  const { breaking } = await prompt({
    type: 'input',
    name: 'breaking',
    message: PromptMessage.BREAK,
    required: false,
    initial: message.breaking,
    result: x => x.trim()
  })
  return Object.assign(message, { breaking })
}

export async function promptIssues(
  message: CommitMessage = {},
  config: Config = DefaultConfig
) {
  const result: string[] = []
  for (let i = 0; i < 20; i++) {
    const initial =
      message.issues && i < message.issues.length
        ? message.issues[i]
        : undefined

    const { issue } = await prompt({
      type: 'input',
      name: 'issue',
      message: PromptMessage.ISSUE,
      required: false,
      result: x => x.trim(),
      initial
    })
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
  const { commit } = await prompt({
    name: 'commit',
    message: PromptMessage.CONFIRM,
    type: 'confirm',
    initial: true,
    separator: () => '',
    format: () => ''
  })

  return commit
}
