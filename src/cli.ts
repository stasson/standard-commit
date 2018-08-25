import { formatMessage, promptCommitMessage } from './lib'

async function main() {
  const commit = await promptCommitMessage();
  const message = formatMessage(commit)
  console.log(message)
}

main()
