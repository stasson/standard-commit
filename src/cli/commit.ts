import * as meow from 'meow'

import {
  formatMessage,
  loadConfig,
  promptCommitMessage,
  promptConfirmCommit,
  gitCommit,
  gitCanCommit,
  gitCommitAndEdit
} from '../lib'

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
      noVerify: {
        type: 'boolean',
        alias: 'n'
      },
      verify: {
        type: 'boolean',
        default: 'true'
      },
      edit: {
        type: 'boolean',
        alias: 'e'
      },
      dryRun: {
        type: 'boolean'
      }
    }
  }
)

async function main(cli: meow.Result) {
  try {
    // commit args
    const { flags } = cli
    const commitArgs = []
    if (flags.all) commitArgs.push('-a')
    if (flags.signoff) commitArgs.push('-s')
    if (flags.noVerify || !flags.verify) commitArgs.push('-n')
    if (flags.dryRun) commitArgs.push('--dry-run')

    // setup
    const configPromise = loadConfig()
    if (!(await gitCanCommit(...commitArgs))) {
      process.exit(1)
    }
    const config = await configPromise

    // prompt for commit message
    const commitmsg = await promptCommitMessage({}, config)
    const confirm = await promptConfirmCommit(config)

    // commit
    if (confirm) {
      const message = formatMessage(commitmsg)
      if (flags.edit || confirm === 'edit') {
        const code = await gitCommitAndEdit(message, ...commitArgs)
        process.exit(code)
      } else {
        const code = await gitCommit(message, ...commitArgs)
        process.exit(code)
      }
    }
  } catch (err) {
    process.exit(err.code)
  }
}

main(cli)
