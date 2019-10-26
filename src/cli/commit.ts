import meow from 'meow'
import fs from 'fs-extra'
import readPkgUp from 'read-pkg-up'
import writePackage from 'write-pkg'
import {
  gitCommit,
  gitCommitAndEdit,
  formatMessage,
  promptConfirmCommit,
  promptCommitMessage,
  gitCanCommit,
  loadConfig,
  promptConfig,
  promptPackageUpdate
} from '../lib'

const cli = meow(
  `
  Usage: standard-commit [options...]

  Where <options> is one of:

    -i --init
    initialize a standard-commit config file    

    -a --all         
    Automatically stage files that have been modified.
    
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

const { flags } = cli

if (flags.init) {
  init()
} else {
  commit({
    all: flags.all,
    signoff: flags.signoff,
    noVerify: flags.noVerify || !flags.verify,
    dryRun: flags.dryRun,
    edit: flags.edit
  })
}

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

    // exit if can not commit
    if (!(await gitCanCommit(...commitArgs))) {
      process.exitCode = 1
    }

    // prompt for commit message
    const config = await loadConfig()
    const commitmsg = await promptCommitMessage({}, config)
    const confirm = await promptConfirmCommit(config)

    // commit
    if (confirm) {
      const message = formatMessage(commitmsg)
      process.exitCode = await gitCommit(message, ...commitArgs)
    }
  } catch (err) {
    console.error('Internal Error:', err.message)
    process.exitCode = err.code
  }
}

async function init() {
  const config = await promptConfig()
  const { updatePackage } = await promptPackageUpdate()
  if (updatePackage) {
    const pkgUp = await readPkgUp()
    const pkg = pkgUp.package || {}
    const path = pkgUp.path || 'package.json'
    pkg['standard-commit'] = config
    await writePackage(path, pkg)
  } else {
    await fs.outputJSON('.standard-commitrc.json', config, { spaces: 2 })
  }
}
