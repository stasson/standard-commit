import { formatMessage, promptCommitMessage, promptConfirmCommit } from './lib'
import * as execa from 'execa'
// import * as listr from 'listr'

async function main() {
  const commit = await promptCommitMessage()
  const message = formatMessage(commit)
  const doCommit = await promptConfirmCommit()

  if (doCommit) {
    const commitArgs = ['commit', '-u', '--file', '-']

    const git = execa('git', commitArgs)
    git.stdout.pipe(process.stdout)
    git.stderr.pipe(process.stderr)
    git.stdin.write(message)
    git.stdin.end()

    try {
      let out = await git
      // tslint:disable-next-line:no-console
      console.log(out)
    } catch (err) {
      process.exit(err.code)
    }
  }
}

main()
