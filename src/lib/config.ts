import cosmiconfig from 'cosmiconfig'

export interface Config {
  /**
   * Allowed types
   *
   * @default ['feat','fix','chore','docs','style','refactor','test',...]
   */
  types?: string[]

  /**
   * When set to 'staged', suggest from staged files (git).
   * When set to 'packages, suggest from package names (monorepo).
   * When set to an array, the list of scopes.
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
   * whether to strip the scope for scoped packages
   * @default true
   */
  stripPackageScope?: boolean

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
  types: ['feat', 'fix', 'chore', 'docs', 'test'],
  scopes: 'staged',
  promptScope: false,
  stripPackageScope: true,
  promptBody: true,
  promptBreaking: true,
  promptIssues: true,
  promptConfirm: true
}

const config = explorer.search().then(result => {
  const config = Object.create(DefaultConfig)
  if (result && result.config) {
    Object.assign(config, result.config)
  }
  return config
})

export async function loadConfig() {
  return (await config) as Config
}
