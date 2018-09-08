import * as cosmiconfig from 'cosmiconfig'

export interface Config {
  /**
   * Allowed types
   *
   * @default [ 'feat', 'fix', 'docs', 'refactor', 'chore' ...]
   */
  types?: string[]

  /**
   * When set to 'suggest', scope is optional.
   * When set to 'enforce, scope can not be empty.
   * When set to "none", scope prompt is skipped.
   * When set to an array, the list of allowed scopes.
   *
   * @default 'suggest'
   */
  scopes?: 'suggest' | 'enforce' | 'none' | string[]

  /**
   * set to false to skip.
   *
   * @default true
   */
  promptBody: boolean

  /**
   * set to false to skip.
   *
   * @default true
   */
  promptBreaking: boolean

  /**
   * set to false to skip.
   *
   * @default true
   */
  promptIssues: boolean

  /**
   * set to false to skip.
   *
   * @default true
   */
  promptConfirm: boolean
}

const explorer = cosmiconfig('standard-commit')

export const DefaultConfig: Config = {
  scopes: 'suggest',
  types: [
    'feat',
    'fix',
    'style',
    'docs',
    'refactor',
    'perf',
    'build',
    'ci',
    'test',
    'chore'
  ],
  promptBody: true,
  promptBreaking: true,
  promptIssues: true,
  promptConfirm: true
}

export async function loadConfig() {
  const config = Object.create(DefaultConfig)
  const result = await explorer.search()
  if (result && result.config) {
    Object.assign(config, result.config)
  }
  return config as Config
}
