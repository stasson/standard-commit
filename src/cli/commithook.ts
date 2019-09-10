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

    if (report.errors.length > 0) {
      process.stdout.write(chalk.red(header))
    } else if (report.warnings.length > 0) {
      process.stdout.write(chalk.yellow(header))
    } else {
      process.stdout.write(chalk.blue(header))
    }

    const output = await commitFormatReport(report)
    process.stdout.write(output)
    process.stdout.write(chalk.reset(EOL))

    process.exitCode = report.errors.length > 0 ? -1 : 0
  } catch (err) {
    // tslint:disable-next-line:no-console
    console.error(err)
    process.exitCode = -1
  }
}

commitHook()
