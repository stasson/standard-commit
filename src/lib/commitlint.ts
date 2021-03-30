import load from '@commitlint/load'
import lint from '@commitlint/lint'
import format from '@commitlint/format'
import read from '@commitlint/read'
import configConventional from '@commitlint/config-conventional'
import Rules from '@commitlint/rules'
import message from '@commitlint/message'
import {
  Commit,
  RuleConfigCondition,
  QualifiedRules,
  QualifiedConfig,
  PluginRecords,
} from '@commitlint/types'

import { Config, DefaultConfig } from './config'

export function applyRules(
  rules: QualifiedRules,
  config: Config = DefaultConfig
): QualifiedRules {
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

  // add signed-off-by rule
  if (config.enforceSignedOffBy) {
    Object.assign(rules, {
      'signed-off-by': [2, 'always', 'Signed-off-by: '],
    })
  }

  // enforce ref for type
  if (config.enforceIssueRefs == true) {
    Object.assign(rules, {
      'references-empty': [2, 'never'],
    })
  } else if (Array.isArray(config.enforceIssueRefs)) {
    Object.assign(rules, {
      'references-empty-enum': [2, 'never', config.enforceIssueRefs],
    })
  }

  if (config.rules) {
    Object.assign(rules, config.rules)
  }

  return rules
}

export function applyPlugins(
  plugins: PluginRecords,
  config: Config = DefaultConfig
): PluginRecords {
  return Object.assign(plugins, {
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
}

export function applyParserOpts(
  parserOpts: unknown,
  config: Config = DefaultConfig
): unknown {
  const { issuePrefixes } = config

  return Object.assign(parserOpts, {
    issuePrefixes,
  })
}

export async function loadOptions(config?: Config): Promise<QualifiedConfig> {
  const commitLintConfig: QualifiedConfig = await load(configConventional)
  const cfg = { ...DefaultConfig, ...config }
  applyRules(commitLintConfig.rules, cfg)
  applyPlugins(commitLintConfig.plugins, cfg)
  applyParserOpts(commitLintConfig.parserPreset.parserOpts, cfg)
  return commitLintConfig
}

export async function commitLint(message: string, config?: Config) {
  const options = await loadOptions(config)
  const { rules, plugins, parserPreset } = options
  const { parserOpts } = parserPreset
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
