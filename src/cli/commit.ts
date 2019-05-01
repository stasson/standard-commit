import { cac } from 'cac'
import {
  gitCommit,
  formatMessage,
  promptConfirmCommit,
  promptCommitMessage,
  gitCanCommit,
  loadConfig,
  parseCommitMessage
} from '../lib'

const configCheck = loadConfig()
const commitCheck = gitCanCommit()

const { name, version } = require('../../package.json')
const cli = cac(name)

cli
  .command('[...msg]', 'git conventional commit')
  .option('-a, --all', 'automatically stage files that have been modified')
  .option(
    '-s, --signoff',
    'add Signed-off-by at the end of the commit log message'
  )
  .option('--no-verify', 'bypass the pre-commit and commit-msg hooks')
  .option('-m, --message <header>', 'commit message')
  .option('-f, --fix <issue>', 'issue(s) being fixed')
  .option('-b, --breaking <breaking>', 'breaking notice')
  .allowUnknownOptions()
  .action(async (x, options) => {
    const { all, signoff, verify, dryRun, message, fix, breaking } = options
    commit({ all, signoff, verify, dryRun, message, fix, breaking })
  })

cli.help()
cli.version(version)
cli.parse()

async function commit(flags: {
  all?: boolean
  signoff?: boolean
  verify?: boolean
  dryRun?: boolean
  message?: string | string[]
  fix?: string | string[]
  breaking?: string
}) {
  try {
    // commit args
    const commitArgs = []
    if (flags.all) commitArgs.push('-a')
    if (flags.signoff) commitArgs.push('-s')
    if (!flags.verify) commitArgs.push('-n')
    if (flags.dryRun) commitArgs.push('--dry-run')

    const message: string[] = Array.isArray(flags.message)
      ? flags.message
      : [flags.message]

    const input = parseCommitMessage(message[0])
    input.body = message.slice(1)
    input.issues = Array.isArray(flags.fix) ? flags.fix : [flags.fix]
    input.breaking = flags.breaking

    // setup
    if (!(await commitCheck)) {
      process.exit(1)
    }
    const config = await configCheck

    // prompt for commit message
    const commitmsg = await promptCommitMessage(input, config)
    const confirm = await promptConfirmCommit(config)

    // commit
    if (confirm) {
      const message = formatMessage(commitmsg)
      const code = await gitCommit(message, ...commitArgs)
      process.exit(code)
    }
  } catch (err) {
    process.exit(err.code)
  }
}
