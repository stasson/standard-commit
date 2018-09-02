import * as cosmiconfig from 'cosmiconfig'

export interface Config {
  scope?: 'none' | 'required'
}

const explorer = cosmiconfig('standard-commit')

const defaults = {}

export async function loadConfig() {
  const config = {}
  Object.assign(config, defaults)
  const result = await explorer.search()
  if (result && result.config) {
    Object.assign(config, result.config)
  }
  return config as Config
}
