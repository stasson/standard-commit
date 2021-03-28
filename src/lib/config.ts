import { cosmiconfig } from 'cosmiconfig'

export interface Config {
  /**
   * Allowed types
   *
   * @default ['feat','fix','chore','docs','style','refactor','test']
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
   * set to true to enforce 'Signed-off-by:' in footer.
   *
   * @default false
   */
  enforceSignedOffBy?: boolean

  /**
   * enforce issue reference when true else for specified list of types.
   *
   * @default []
   */
  enforceIssueRefs?: boolean | string[]

  /**
   * enforce issue reference to match the given pattern
   *
   * @default ['#']
   */
  issuePrefixes?: string[]

  /**
   * extra commitlint rules
   *
   * see http://marionebl.github.io/commitlint/#/reference-rules
   *
   * @default []
   */
  rules?: {}
}

export const DefaultConfig: Config = {
  types: ['feat', 'fix', 'chore', 'docs', 'style', 'refactor', 'test'],
  scopes: 'staged',
  promptScope: false,
  stripPackageScope: true,
  promptBody: true,
  promptBreaking: true,
  promptIssues: true,
  promptConfirm: true,
  enforceSignedOffBy: false,
  enforceIssueRefs: false,
  issuePrefixes: ['#'],
}

export async function loadConfig() {
  const explorer = cosmiconfig('standard-commit')
  const config = Object.create(DefaultConfig)
  const result = await explorer.search()
  if (result && result.config) {
    Object.assign(config, result.config)
  }
  return config as Config
}
