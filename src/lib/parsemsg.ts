import { CommitMessage } from './commitmsg'

const headerPattern = /^(feat|fix)(\((\w+)\))?:\s(.*)$/

export function parseCommitMessage(message: string): CommitMessage {
  const commit: CommitMessage = {}

  // TODO

  return commit
}