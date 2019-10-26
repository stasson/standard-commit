import { EOL } from 'os'
import colors from 'ansi-colors'
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
      process.stdout.write(colors.red(header))
    } else if (report.warnings.length > 0) {
      process.stdout.write(colors.yellow(header))
    } else {
      process.stdout.write(colors.blue(header))
    }

    const output = await commitFormatReport(report)
    process.stdout.write(output)
    process.stdout.write(colors.reset(EOL))

    process.exitCode = report.errors.length > 0 ? -1 : 0
  } catch (err) {
    // tslint:disable-next-line:no-console
    console.error(err)
    process.exitCode = -1
  }
}

commitHook()
