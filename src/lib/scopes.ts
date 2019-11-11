import { gitStagedPaths, gitTopLevel } from './gitutils'
import { Config } from './config'
import path from 'path'
import util from 'util'
import fs from 'fs'

const readFile = util.promisify(fs.readFile)

export function sortScopes(suggestions: object) {
  return Object.keys(suggestions).sort((a, b) => {
    return suggestions[b] - suggestions[a]
  })
}

export async function getStagedScopesSuggestions() {
  const paths = await gitStagedPaths()

  const suggestions = sortScopes(
    paths.reduce((s, f) => {
      const { name, dir } = path.parse(f)
      const keys = ['*', ...dir.split('/').filter(d => d), name].reverse()
      let weight = 1
      for (const k of keys) {
        s[k] = weight++
      }
      return s
    }, {})
  )
  return suggestions
}

export async function getPackageSuggestions(config: Config) {
  const topLevel = gitTopLevel()
  const unstagedPaths = await gitStagedPaths()
  const paths = sortScopes(
    unstagedPaths.reduce((s, f) => {
      const packages = []
      f = path.dirname(f)
      while (f != '.') {
        packages.push(path.join(f, 'package.json'))
        f = path.dirname(f)
      }
      for (const pkg of packages) {
        const weight = s[pkg]
        s[pkg] = weight ? weight + 1 : 1
      }
      return s
    }, {})
  )
  paths.push('package.json')
  const rootDir = await topLevel
  const suggestions = []

  for (let f of paths) {
    try {
      f = path.join(rootDir, f)
      const pck = await readFile(f, 'utf8')
      let { name } = JSON.parse(pck)

      if (config.stripPackageScope) {
        name = name.replace(/@.+\//, '')
      }

      suggestions.push(name)
    } catch {}
  }
  return suggestions
}

export async function suggestScopes(config: Config) {
  if (config.promptScope) {
    if (config.scopes == 'staged') {
      return getStagedScopesSuggestions()
    } else if (config.scopes == 'packages') {
      return getPackageSuggestions(config)
    } else {
      return config.scopes || []
    }
  }
  return []
}
