export interface CommitMessage {
  type?: string
  scope?: string
  subject?: string
  body?: string[]
  breaking?: string
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
  'test',
  'chore'
]
