import { gitUnstagedPaths } from './gitutils'
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

export async function suggestScopes() {
  const suggestions = await getUnstagedScopesSuggestions()
  return sortScopes(suggestions)
}
