import load from '@commitlint/load'
import lint from '@commitlint/lint'
import format from '@commitlint/format'
import read from '@commitlint/read'
import commitlintConfig from '@commitlint/config-conventional'
import conventionalcommits from 'conventional-changelog-conventionalcommits'

import Rules from '@commitlint/rules'
import message from '@commitlint/message'
import {
  Commit,
  RuleConfigCondition,
  QualifiedRules,
  QualifiedConfig,
} from '@commitlint/types'

import { Config, DefaultConfig } from './config'

export function applyRules(
  qualifiedConfig: QualifiedConfig,
  config: Config = DefaultConfig
): QualifiedConfig {
  // update types
  if (config.types) {
    Object.assign(qualifiedConfig.rules, {
      'type-enum': [2, 'always', config.types],
    })
  }

  // add scope rules
  if (config.promptScope) {
    if (config.promptScope === 'enforce') {
      Object.assign(qualifiedConfig.rules, {
        'scope-empty': [2, 'never'],
      })

      if (Array.isArray(config.scopes)) {
        Object.assign(qualifiedConfig.rules, {
          'scope-enum': [2, 'always', config.scopes],
        })
      }
    }
  } else {
    Object.assign(qualifiedConfig.rules, {
      'scope-empty': [2, 'always'],
    })
  }

  // for backward compat
  Object.assign(qualifiedConfig.rules, {
    'scope-case': [2, 'always', 'lower-case'],
  })

  // add signed-off-by rule
  if (config.enforceSignedOffBy) {
    Object.assign(qualifiedConfig.rules, {
      'signed-off-by': [2, 'always', 'Signed-off-by: '],
    })
  }

  // enforce ref for type
  if (config.enforceIssueRefs == true) {
    Object.assign(qualifiedConfig.rules, {
      'references-empty': [2, 'never'],
    })
  } else if (Array.isArray(config.enforceIssueRefs)) {
    Object.assign(qualifiedConfig.rules, {
      'references-empty-enum': [2, 'never', config.enforceIssueRefs],
    })
  }

  if (config.rules) {
    Object.assign(qualifiedConfig.rules, config.rules)
  }

  return qualifiedConfig
}

export function applyPlugins(
  qualifiedConfig: QualifiedConfig,
  config: Config = DefaultConfig
): QualifiedConfig {
  Object.assign(qualifiedConfig.plugins, {
    localPlugin: {
      rules: {
        'references-empty-enum': (
          parsed: Commit,
          when: RuleConfigCondition = 'never',
          value?: string[]
        ) => {
          const { references, type } = parsed
          if (!type || !value.includes(type)) {
            return [true]
          }
          const negated = when === 'always'
          const empty = references.length === 0
          return [
            negated ? empty : !empty,
            message([
              'references',
              negated ? 'must' : 'must not',
              `be empty when type is one of [${value.join(', ')}]`,
            ]),
          ]
        },
      },
    },
  })
  return qualifiedConfig
}

export async function loadOptions(config?: Config): Promise<QualifiedConfig> {
  const { rules } = commitlintConfig
  const qualifiedConfig: QualifiedConfig = await load({ rules })
  config = { ...DefaultConfig, ...config }
  applyRules(qualifiedConfig, config)
  applyPlugins(qualifiedConfig, config)
  return qualifiedConfig
}

export async function loadParserOpts(config?: Config) {
  const { issuePrefixes } = config || {}
  const { parserOpts } = await conventionalcommits({ issuePrefixes })
  return parserOpts
}

export async function commitLint(message: string, config?: Config) {
  const parserOpts = await loadParserOpts(config)
  const options = await loadOptions(config)
  const { rules, plugins } = options
  return lint(message, rules, { plugins, parserOpts })
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
export function validateSubject(subject: string, rules: QualifiedRules) {
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
