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

export function formatIssues(issues: string[]) {
  return issues
    .map((issue) => {
      if (/^(\w+):\s(.*)/.test(issue)) {
        const line = issue.trim()
        return line[0].toUpperCase() + line.slice(1)
      }
      const id = issue.trim()
      return `Refs: ${Number.isInteger(Number(id)) ? `#${id}` : id}`
    })
    .join('\n')
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
    const block = formatIssues(commit.issues)
    message = appendBlock(message, block)
  }

  return message + EOL
}
