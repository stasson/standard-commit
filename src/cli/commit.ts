import * as meow from 'meow'
import { commitCommand } from '../lib'

const cli = meow(
  `
  Usage: git cc [options...]

  Where <options> is one of:

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

const { flags } = cli

commitCommand({
  all: flags.all,
  signoff: flags.signoff,
  noVerify: flags.noVerify || !flags.verify,
  dryRun: flags.dryRun,
  edit: flags.edit
})
