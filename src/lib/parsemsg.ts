import { CommitMessage } from './commitmsg'
import linewrap from 'linewrap'
import { EOL } from 'os'

const wrapLines = linewrap(72)
const splitLinePattern = /$/gm
const splitWordsPattern = /\s+/gm
const headerPattern = /^(\w*)(?:\(([\w$.\-* ]*)\))?:\s*(.*)/

export function unwrap(block: string) {
  return block.split(splitWordsPattern).join(' ')
}

export function parseCommitHeader(message: string): CommitMessage {
  const match = message.match(headerPattern)

  let type, scope, subject
  if (match) {
    type = match[1]
    scope = match[2]
    subject = match[3]
  } else {
    const header = message.split(splitLinePattern)[0]
    subject = header && header.trim()
  }

  const commit: CommitMessage = { type, subject }
  if (scope) commit.scope = scope
  return commit
}

export function parseBody(message: string) {
  const bodyLines = message.split(/\r?\n/)
  const numlines = bodyLines.length

  const body = []
  let block = null

  for (let i = 1; i < numlines; i++) {
    const line = bodyLines[i]
    if (
      /^(BREAKING CHANGE|close|closes|fix|fixes|resolve|resolves)./.test(line)
    ) {
      break
    }

    if (line.match(/^\s*$/)) {
      block && body.push(unwrap(wrapLines(block)))
      block = null
    } else {
      block = block ? [block, line].join(EOL) : line
    }
  }

  return body.length ? body : undefined
}
export function parseBreaking(message: string) {
  const match = /^BREAKING CHANGE:(.*)$/gm.exec(message)
  if (match && match[1]) return match[1].trim()
}

export function parseIssues(message: string) {
  const r = /^(close|closes|fix|fixes|resolve|resolves)\s+(.*)$/gm
  const issues = []
  let match
  while ((match = r.exec(message)) !== null) {
    issues.push(match[2].trim())
  }
  return issues.length ? issues : undefined
}

export function parseCommitMessage(message?: string): CommitMessage {
  if (!message) return {}
  const commit = parseCommitHeader(message)
  const body = parseBody(message)
  const breaking = parseBreaking(message)
  const issues = parseIssues(message)

  if (breaking) commit.breaking = breaking
  if (issues) commit.issues = issues
  if (body) commit.body = body
  return commit
}
