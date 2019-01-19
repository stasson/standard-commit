import * as cosmiconfig from 'cosmiconfig'

export interface Config {
  /**
   * Allowed types
   *
   * @default [ 'feat', 'fix', 'docs', 'refactor', 'chore' ...]
   */
  types?: string[]

  /**
   * Allowed scopes
   *
   * @default 'staged'
   */
  scopes?: 'staged' | 'packages' | string[]

  /**
   * When set to 'suggest', scope is optional.
   * When set to 'enforce, scope can not be empty.
   * When set to false, scope prompt is skipped.
   * @default 'suggest'
   */
  promptScope?: 'suggest' | 'enforce' | false

  /**
   * set to false to skip.
   *
   * @default true
   */
  promptBody?: boolean

  /**
   * set to false to skip.
   *
   * @default true
   */
  promptBreaking?: boolean

  /**
   * set to false to skip.
   *
   * @default true
   */
  promptIssues?: boolean

  /**
   * set to false to skip.
   *
   * @default true
   */
  promptConfirm?: boolean

  /**
   * extra commitlint rules
   *
   * see http://marionebl.github.io/commitlint/#/reference-rules
   *
   * @default []
   */
  rules?: {}
}

const explorer = cosmiconfig('standard-commit')

export const DefaultConfig: Config = {
  types: [
    'feat',
    'fix',
    'chore',
    'docs',
    'style',
    'refactor',
    'test',
    'perf',
    'improvment'
  ],
  scopes: 'staged',
  promptScope: 'suggest',
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
