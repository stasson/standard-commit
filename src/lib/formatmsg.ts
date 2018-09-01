import * as linewrap from 'linewrap'
import { EOL } from 'os'
import { CommitMessage } from './commitmsg'

const wrapLines = linewrap(72)

function appendBlock(message: string, block: string): string {
  return [message, '', block].join(EOL)
}

function formatLines(lines: string[]) {
  return wrapLines(lines.map(line => line.trim()).join(EOL))
}

export function formatHeader(type, scope, subject) {
  type = type || ''
  subject = subject || ''
  scope = scope ? `(${scope})` : ''
  return `${type}${scope}: ${subject}`
}

export function formatBreaking(breakingChanges: string) {
  return 'BREAKING CHANGE: ' + breakingChanges.trim() + EOL
}

export function formatIssues(issues: string[], prefix = 'closes') {
  return wrapLines(issues.map(issue => prefix + ' ' + issue.trim()).join(EOL))
}

export function formatBody(body: string[]) {
  return body ? formatLines(body) : ''
}

export function formatMessage(commit: CommitMessage): string {
  let message = formatHeader(commit.type, commit.scope, commit.subject)

  if (commit.body) {
    const block = formatBody(commit.body)
    message = appendBlock(message, block)
  }

  if (commit.breaking) {
    const block = formatBreaking(commit.breaking)
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
