import lint from '@commitlint/lint'
import format, {
  FormattableProblem,
  FormattableResult,
  WithInput
} from '@commitlint/format'
import read from '@commitlint/read'
import conventional from '@commitlint/config-conventional'

import { Config, DefaultConfig } from './config'

export type CommitlintIssue = FormattableProblem & {
  valid?: boolean
}

export type CommitlintReport = FormattableResult &
  WithInput & {
    valid?: boolean
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
  const rules = conventional.rules

  // const rules = {
  //   'body-leading-blank': [1, 'always'],
  //   'footer-leading-blank': [1, 'always'],
  //   'header-max-length': [2, 'always', 72],
  //   'subject-case': [2, 'always', ['lower-case']],
  //   'subject-empty': [2, 'never'],
  //   'subject-full-stop': [2, 'never', '.'],
  //   'type-case': [2, 'always', 'lower-case'],
  //   'type-empty': [2, 'never'],
  //   'type-enum': [2, 'always', config.types]
  // }

  // update types
  if (config.types) {
    Object.assign(rules, {
      'type-enum': [2, 'always', config.types]
    })
  }

  // add scope rules
  if (config.promptScope) {
    if (config.promptScope === 'enforce') {
      Object.assign(rules, {
        'scope-empty': [2, 'never']
      })

      if (Array.isArray(config.scopes)) {
        Object.assign(rules, {
          'scope-enum': [2, 'always', config.scopes]
        })
      }
    }
  } else {
    Object.assign(rules, {
      'scope-empty': [2, 'always']
    })
  }

  if (config.rules) {
    Object.assign(rules, config.rules)
  }

  return lint(message, rules)
}

export async function commitFormatReport(
  report: CommitlintReport
): Promise<string> {
  return format(
    {
      results: [report]
    },
    { color: true }
  )
}

export async function commitRead(range: Range): Promise<string[]> {
  return read(range)
}
