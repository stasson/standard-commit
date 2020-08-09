import linewrap from 'linewrap'
import { EOL } from 'os'
import { CommitMessage } from './commitmsg'

const wrapLines = linewrap(72)

function appendBlock(message: string, block: string): string {
  if (block) {
    return [message, '', block].join(EOL)
  } else {
    return message
  }
}

function formatLines(lines: string[]) {
  return wrapLines(lines.map((line) => line.trim()).join(EOL))
}

export function formatHeader(type, scope, subject) {
  type = type || ''
  subject = subject || ''
  scope = scope ? `(${scope})` : ''
  return `${type}${scope}: ${subject}`
}

export function formatBreaking(change: string) {
  return 'BREAKING CHANGE: ' + change.trim()
}

export function formatIssues(issues: string[], prefix = 'Closes') {
  const list = issues
    .map((issue) => {
      const id = issue.trim()
      return id[0] == '#' ? id : `#${id}`
    })
    .join(', ')
  return `${prefix} ${list}`
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

  if (commit.issues && commit.issues.length) {
    const block = formatIssues(
      commit.issues,
      commit.type === 'fix' ? 'Fixes' : 'Closes'
    )
    message = appendBlock(message, block)
  }

  return message + EOL
}
