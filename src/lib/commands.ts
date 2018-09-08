import { loadConfig } from './config'
import { gitCanCommit, gitCommitAndEdit, gitCommit } from './gitutils'
import { promptCommitMessage, promptConfirmCommit } from './prompt'
import { formatMessage } from './formatmsg'

export async function commitCommand(flags: {
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
