import * as lint from '@commitlint/lint'
import * as format from '@commitlint/format'
import * as read from '@commitlint/read'

import { Config, DefaultConfig } from './config'

export type CommitlintIssue = {
  level: number
  valid: boolean
  name: string
  message: string
}

export type CommitlintReport = {
  valid: boolean
  errors: CommitlintIssue[]
  warnings: CommitlintIssue[]
}

type Range = {
  /* Lower end of the commit range to read */
  from?: string
  /* Upper end of the commit range to read */
  to?: string
  /* Wether (boolean) to read from ./.git/COMMIT_EDITMSG or where to read from (string) */
  edit?: boolean | string
}

export async function commitLint(
  message: string,
  config: Config = DefaultConfig
): Promise<CommitlintReport> {
  const rules = {
    'body-leading-blank': [1, 'always'],
    'footer-leading-blank': [1, 'always'],
    'header-max-length': [2, 'always', 72],
    'subject-case': [2, 'always', ['lower-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'type-enum': [2, 'always', config.types]
  }

  // add scope rules
  if (config.promptScope) {
    Object.assign(rules, {
      'scope-case': [2, 'always', 'lower-case']
    })

    if (config.promptScope === 'enforce') {
      Object.assign(rules, {
        'scope-empty': [2, 'never']
      })
    }
  } else {
    Object.assign(rules, {
      'scope-empty': [2, 'always']
    })
  }

  if (config.scopes && config.scopes.length > 0) {
    Object.assign(rules, {
      'scope-enum': [2, 'always', config.scopes]
    })
  }

  if (config.rules) {
    Object.assign(rules, config.rules)
  }

  return lint(message, rules)
}

export async function commitFormatReport(
  report: CommitlintReport
): Promise<string[]> {
  return format(report, { color: true })
}

export async function commitRead(range: Range): Promise<string[]> {
  return read(range)
}