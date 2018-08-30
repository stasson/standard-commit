import * as meow from 'meow'

import { formatMessage, promptCommitMessage, promptConfirmCommit } from '../lib'
import * as execa from 'execa'

const cli = meow(
  `
  Usage: 
  
  standard-commit <options> 
  git cc <options>


  Options:

  -a --all         
  Tell the command to automatically stage files that have been modified.
  
  -s --signoff     
  Add Signed-off-by at the end of the commit log message.
  
  -n --no-verify   
  Bypasses the pre-commit and commit-msg hooks.
  
  -e --edit        
  further edit the message.
  `,
  {
    flags: {
      all: {
        type: 'boolean',
        alias: 'a'
      },
      signoff: {
        type: 'boolean',
        alias: 's'
      },
      // -n
      // --no-verify
      // This option bypasses the pre-commit and commit-msg hooks.
      // See also githooks(5).
      noVerify: {
        type: 'boolean',
        alias: 'n'
      },
      verify: {
        type: 'boolean',
        default: 'true'
      },
      // -e
      // --edit
      // The message taken from file with -F, command line with -m, and from commit object with -C are usually used as the commit log message unmodified. This option lets you further edit the message taken from these sources.
      // --no-edit
      // Use the selected commit message without launching an editor. For example, git commit --amend --no-edit amends a commit without changing its commit message.
      edit: {
        type: 'boolean',
        alias: 'e'
      }
    }
  }
)

async function commit(message: string, ...args) {
  const commitArgs = ['commit', ...args, '--file', '-']

  const git = execa('git', commitArgs)
  git.stdout.pipe(process.stdout)
  git.stderr.pipe(process.stderr)
  git.stdin.write(message)
  git.stdin.end()

  return (await git).code
}

async function main(cli: meow.Result) {
  try {
    // prompt for commit message
    const commitmsg = await promptCommitMessage()
    const confirm = await promptConfirmCommit()

    if (confirm) {
      const { flags } = cli
      const args = []

      // commit args
      if (flags.all) args.push('-a')
      if (flags.signoff) args.push('-s')
      if (flags.noVerify || !flags.verify) args.push('-n')
      if (flags.edit) args.push('-e')

      const message = formatMessage(commitmsg)
      const code = await commit(message, ...args)
      process.exit(code)
    }
  } catch (err) {
    process.exit(err.code)
  }
}

main(cli)
