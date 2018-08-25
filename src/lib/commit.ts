export interface CommitMessage {
  type?: string
  scope?: string
  description?: string
  body?: string[]
  breakingChanges?: string[]
  issues?: string[]
}

export const CommitTypes = [
  'feat',
  'fix',
  'style',
  'docs',
  'refactor',
  'perf',
  'build',
  'ci',
  'chore'
]
