import { gitUnstagedPaths, gitTopLevel } from './gitutils'
import { Config } from './config'
import * as path from 'path'
import * as util from 'util'
import * as fs from 'fs'

const readFile = util.promisify(fs.readFile)

export function sortScopes(suggestions: object) {
  return Object.keys(suggestions).sort((a, b) => {
    return suggestions[b] - suggestions[a]
  })
}

export async function getUnstagedScopesSuggestions() {
  const paths = await gitUnstagedPaths()

  const suggestions = sortScopes(
    paths.reduce((s, f) => {
      const { name, dir } = path.parse(f)
      const keys = [name, ...dir.split('/').filter(d => d)]
      for (const k of keys) {
        const weight = s[k]
        s[k] = weight ? weight + 1 : 1
      }
      return s
    }, {})
  )

  return suggestions
}

export async function getPackageSuggestions() {
  const topLevel = gitTopLevel()
  const unstagedPaths = await gitUnstagedPaths()
  const paths = sortScopes(
    unstagedPaths.reduce((s, f) => {
      const packages = ['package.json']
      f = path.dirname(f)
      while (f != '.') {
        packages.unshift(path.join(f, 'package.json'))
        f = path.dirname(f)
      }
      for (const pkg of packages) {
        const weight = s[pkg]
        s[pkg] = weight ? weight + 1 : 1
      }
      return s
    }, {})
  )

  const rootDir = await topLevel
  const suggestions = []

  for (let f of paths) {
    try {
      f = path.join(rootDir, f)
      const pck = await readFile(f, 'utf8')
      const { name } = JSON.parse(pck)
      suggestions.push(name)
    } catch {}
  }
  return suggestions
}

export async function suggestScopes(config: Config) {
  if (config.promptScope) {
    if (config.scopes == 'unstaged') {
      return getUnstagedScopesSuggestions()
    } else if (config.scopes == 'packages') {
      return getPackageSuggestions()
    } else {
      return config.scopes || []
    }
  }
  return []
}
