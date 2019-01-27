import * as meow from 'meow'
import * as updateNotifier from 'update-notifier'
import {
  gitCommit,
  gitCommitAndEdit,
  formatMessage,
  promptConfirmCommit,
  promptCommitMessage,
  gitCanCommit,
  loadConfig
} from '../lib'

const cli = meow(
  `
  Usage: standard-commit [options...]

  Where <options> is one of:

    -a --all         
    Tell the command to automatically stage files that have been modified.
    
    -s --signoff     
    Add Signed-off-by at the end of the commit log message.
    
    -n --no-verify   
    Bypasses the pre-commit and commit-msg hooks.
    
    -e --edit        
    further edit the message.

  Alias: git cc <option> with:
  
    git config --global alias.cc '!standard-commit' 
  `,
  {
    description: 'standard-commit',
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

updateNotifier(cli.pkg).notify()

async function commit(flags: {
  all?: boolean
  signoff?: boolean
  noVerify?: boolean
  dryRun?: boolean
  edit?: boolean
}) {
  try {
    // commit args
    const commitArgs = []
    if (flags.all) commitArgs.push('-a')
    if (flags.signoff) commitArgs.push('-s')
    if (flags.noVerify) commitArgs.push('-n')
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

const { flags } = cli

commit({
  all: flags.all,
  signoff: flags.signoff,
  noVerify: flags.noVerify || !flags.verify,
  dryRun: flags.dryRun,
  edit: flags.edit
})
