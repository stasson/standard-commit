import * as linewrap from 'linewrap'
import { EOL } from 'os'
import { CommitMessage } from './commit'

const wrapLines = linewrap(72)

function appendBlock(message: string, block: string): string {
  return [message, '', block].join(EOL)
}

function formatLines(lines: string[]) {
  return wrapLines(lines.map(line => line.trim()).join(EOL))
}

export function formatHeader(type, scope, description) {
  type = type || ''
  description = description || ''
  scope = scope ? `(${scope})` : ''
  return `${type}${scope}: ${description}`
}

export function formatBreaking(breakingChanges: string[]) {
  return wrapLines(
    breakingChanges
      .map(line => {
        return 'BREAKING CHANGE: ' + line.trim() + EOL
      })
      .join(EOL)
      .trim()
  )
}

export function formatIssues(issues: string[], prefix = 'closes') {
  return wrapLines(issues.map(issue => prefix + ' ' + issue.trim()).join(EOL))
}

export function formatBody(body: string[]) {
  return body ? formatLines(body) : ''
}

export function formatMessage(commit: CommitMessage): string {
  let message = formatHeader(commit.type, commit.scope, commit.description)

  if (commit.body) {
    const block = formatBody(commit.body)
    message = appendBlock(message, block)
  }

  if (commit.breakingChanges) {
    const block = formatBreaking(commit.breakingChanges)
    message = appendBlock(message, block)
  }

  if (commit.issues) {
    const block = formatIssues(
      commit.issues,
      commit.type === 'fix' ? 'fixes' : 'closes'
    )
    message = appendBlock(message, block)
  }

  return message + EOL
}
