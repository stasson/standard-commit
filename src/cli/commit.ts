import * as meow from 'meow'

import {
  formatMessage,
  loadConfig,
  promptCommitMessage,
  promptConfirmCommit,
  gitCommit,
  gitUnstagedFiles
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
    // load config
    const config = await loadConfig()

    // prompt for commit message
    const commitmsg = await promptCommitMessage({}, config)
    const confirm = await promptConfirmCommit(config)

    if (confirm) {
      const { flags } = cli
      const args = []

      // commit args
      if (flags.all) args.push('-a')
      if (flags.signoff) args.push('-s')
      if (flags.noVerify || !flags.verify) args.push('-n')
      if (flags.edit) args.push('-e')
      if (flags.dryRun) args.push('--dry-run')

      const message = formatMessage(commitmsg)
      const code = await gitCommit(message, ...args)
      process.exit(code)
    }
  } catch (err) {
    process.exit(err.code)
  }
}

main(cli)
