import { gitUnstagedPaths } from './gitutils'
import { DefaultConfig, Config } from './config'
import * as path from 'path'

export async function sortScopes(suggestions: object) {
  return Object.keys(suggestions).sort((a, b) => {
    return suggestions[a] - suggestions[b]
  })
}

export async function getUnstagedScopesSuggestions() {
  const paths = await gitUnstagedPaths()

  const suggestions = paths.reduce((s, f) => {
    const { name, dir } = path.parse(f)
    const keys = [name, ...dir.split('/').filter(d => d)]
    for (const k of keys) {
      const weight = s[k]
      s[k] = weight ? weight + 1 : 1
    }
    return s
  }, {})

  return suggestions
}

export async function suggestScopes(config: Config = DefaultConfig) {
  let scopes: string[] = []

  if (config.promptScope) {
    const unstaged = await getUnstagedScopesSuggestions()
    scopes = await sortScopes(unstaged)

    if (config.scopes && config.scopes.length > 0) {
      // filter scopes
      scopes.filter(scope => config.scopes.indexOf(scope) !== -1)
    }
  }
  return scopes
}
