import { EOL } from 'os'
import chalk from 'chalk'
import { commitRead, loadConfig, commitLint, commitFormatReport } from '../lib'

async function commitHook() {
  try {
    const edit: string = process.env.GIT_PARAMS || '.git/COMMIT_EDITMSG'
    const load = loadConfig()
    const read = commitRead({ edit })
    const config = await load
    const commitmsg = await read
    const report = await commitLint(commitmsg[0], config)

    const header = commitmsg[0].split('\n')[0].trim()

    if (report.valid) {
      process.stdout.write(chalk.blue(header))
    } else {
      process.stdout.write(chalk.red(header))
    }
    process.stdout.write(chalk.reset(EOL))

    const output = await commitFormatReport(report)
    for (const line of output) {
      process.stdout.write(line)
      process.stdout.write(EOL)
    }
    process.exit(report.valid ? 0 : 1)
  } catch (err) {
    // tslint:disable-next-line:no-console
    console.error(err)
    process.exit(1)
  }
}

commitHook()
