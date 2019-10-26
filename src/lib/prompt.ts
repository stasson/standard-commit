import { CommitMessage } from './commitmsg'
import { formatHeader } from './formatmsg'
import { Config, DefaultConfig } from './config'
import { suggestScopes } from './scopes'
import { prompt } from 'enquirer'
import SuggestPrompt from './suggest-prompt'

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
    name: 'type',
    message: PromptMessage.TYPE,
    type: 'autocomplete',
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
      const { scope } = await prompt({
        type: 'autocomplete',
        name: 'scope',
        message: PromptMessage.SCOPE,
        choices: scopes,
        result: input => input.toLowerCase().trim(),
        initial: message.scope
      })
      return Object.assign(message, { scope })
    } else {
      const scope = await new SuggestPrompt({
        name: 'scope',
        message: PromptMessage.SCOPE,
        suggestions: scopes,
        result: input => input.toLowerCase(),
        validate: input => !!input.trim() || 'scope can not be empty'
      }).run()
      return Object.assign(message, { scope })
    }
  } else {
    const { scope } = await prompt({
      type: 'input',
      name: 'scope',
      message: PromptMessage.SCOPE,
      initial: message.scope,
      result: input => input.toLowerCase().trim(),
      validate(input) {
        if (config.promptScope == 'enforce') {
          return !!input.trim() || 'scope can not be empty'
        }
        return true
      }
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
    result: input => input.toLowerCase().trim(),
    validate(input) {
      if (!input) {
        return 'subject can not be empty'
      }
      const header = formatHeader(message.type, message.scope, input)
      if (header.length >= 72) {
        return 'subject is too long'
      }
      return true
    }
  })
  return Object.assign(message, { subject })
}

export async function promptHeader(
  message: CommitMessage = {},
  config: Config = DefaultConfig
) {
  const getscopes = suggestScopes(config)
  message = await promptType(message, config)
  const scopes = (await getscopes).map(s => s.toLowerCase())

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
    const { line } = await prompt({
      type: 'input',
      name: 'line',
      message: PromptMessage.BODY,
      initial: (lines && lines[i]) || undefined,
      result: input => input.trim()
    })

    if (!line) break
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
    initial: message.breaking || undefined,
    result: input => input.trim()
  })
  return Object.assign(message, { breaking })
}

export async function promptIssues(
  message: CommitMessage = {},
  config: Config = DefaultConfig
) {
  const lines = message.issues || []

  const result: string[] = []
  for (let i = 0; i < 20; i++) {
    const { issue } = await prompt({
      type: 'input',
      name: 'issue',
      message: PromptMessage.ISSUE,
      initial: (lines && lines[i]) || undefined,
      result: input => input.trim()
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
  const { commit } = (await prompt({
    type: 'confirm',
    name: 'commit',
    message: PromptMessage.CONFIRM,
    initial: true,
    format: input => (input ? 'Yes' : 'no')
  })) as { commit: boolean }

  return commit
}

export async function promptConfig() {
  const typeChoices = [
    'feat',
    'fix',
    'chore',
    'build',
    'ci',
    'docs',
    'perf',
    'refactor',
    'revert',
    'style',
    'test'
  ]

  const answers = <any>await prompt([
    {
      type: 'multiselect',
      name: 'types',
      message: 'types',
      choices: typeChoices,
      initial: ['feat', 'fix', 'chore', 'docs', 'refactor', 'test']
    },
    {
      type: 'select',
      name: 'promptScope',
      message: 'scope',
      choices: [
        { name: 'none', message: 'no scope' },
        { name: 'suggest', message: 'suggest scope' },
        { name: 'enforce', message: 'enforce scope' }
      ]
    },
    {
      type: 'select',
      name: 'scopes',
      message() {
        const answers = this.state.answers
        return ` ${answers.promptScope}  scope`
      },
      choices: [
        { name: 'staged', message: 'from staged files' },
        { name: 'packages', message: 'from package names (monorepo)' },
        { name: 'list', message: 'from a list' }
      ],
      skip() {
        const answers = this.state.answers
        return answers.promptScope == 'none'
      }
    },
    {
      type: 'list',
      name: 'scopeList',
      message: 'type comma-separated scope names',
      skip() {
        const answers = this.state.answers
        return answers.scopes != 'list'
      }
    }
  ])

  const { types, promptScope, scopes, scopeList } = answers

  const config: Config = { types }
  if (promptScope != 'none') {
    config.promptScope = promptScope
    config.scopes = scopes == 'list' ? scopeList : scopes
  }

  return config
}

export async function promptPackageUpdate() {
  const { updatePackage } = await prompt({
    type: 'select',
    name: 'updatePackage',
    message: 'save config in',
    choices: [{ name: '.standard-commitrc.json' }, { name: 'package.json' }]
  })
  return {
    updatePackage: updatePackage == 'package.json'
  }
}
