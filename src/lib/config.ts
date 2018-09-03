import * as cosmiconfig from 'cosmiconfig'

export interface Config {
  /**
   * @default 'suggest'
   */
  scope?: 'none' | 'enforce' | 'suggest'
}

const explorer = cosmiconfig('standard-commit')

const defaults: Config = {
  scope: 'suggest'
}

export async function loadConfig() {
  const config = Object.create(defaults)
  const result = await explorer.search()
  if (result && result.config) {
    Object.assign(config, result.config)
  }
  return config as Config
}
