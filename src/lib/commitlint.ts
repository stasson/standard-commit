import lint from '@commitlint/lint'
import format from '@commitlint/format'
import read from '@commitlint/read'
import conventional from '@commitlint/config-conventional'
import Rules from '@commitlint/rules'

import { Config, DefaultConfig } from './config'

export function commitRules(config: Config = DefaultConfig) {
  const rules = conventional.rules

  // update types
  if (config.types) {
    Object.assign(rules, {
      'type-enum': [2, 'always', config.types],
    })
  }

  // add scope rules
  if (config.promptScope) {
    if (config.promptScope === 'enforce') {
      Object.assign(rules, {
        'scope-empty': [2, 'never'],
      })

      if (Array.isArray(config.scopes)) {
        Object.assign(rules, {
          'scope-enum': [2, 'always', config.scopes],
        })
      }
    }
  } else {
    Object.assign(rules, {
      'scope-empty': [2, 'always'],
    })
  }

  if (config.rules) {
    Object.assign(rules, config.rules)
  }

  return rules
}

export async function commitLint(
  message: string,
  config: Config = DefaultConfig
) {
  const rules = commitRules(config)
  return lint(message, rules)
}

export async function commitFormatReport(report): Promise<string> {
  return format(
    {
      results: [report],
    },
    { color: true }
  )
}

export async function commitRead(settings: {
  cwd?: string
  from?: string
  to?: string
  edit?: boolean | string
}): Promise<string[]> {
  return read(settings)
}

/** return true or message */
export function validateSubject(
  subject: string,
  config: Config = DefaultConfig
) {
  const rules = commitRules(config)
  for (const rule in rules) {
    if (rule.startsWith('subject')) {
      const [sev, when, cfg] = rules[rule]
      if (sev >= 2) {
        const validate = Rules[rule]
        const [result, message] = validate({ subject }, when, cfg)
        if (!result) return message
      }
    }
  }
  return true
}
