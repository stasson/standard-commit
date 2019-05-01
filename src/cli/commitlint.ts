import { cac } from 'cac'
import chalk from 'chalk'
import { EOL } from 'os'
import { commitRead, loadConfig, commitLint, commitFormatReport } from '../lib'

const { version } = require('../../package.json')
const cli = cac('standard-commitlint')
const load = loadConfig()

cli
  .command('', 'git conventional commit')
  .option('-f, --from', 'lower end of the commit range to lint')
  .option('-t --to', 'upper end of the commit range to lint')
  .action(async options => {
    try {
      let error = false
      const { from, to } = options
      const read = commitRead({ from, to })
      const config = await load
      const commits = await read
      for (const commitmsg of commits) {
        const report = await commitLint(commitmsg, config)
        const header = commitmsg.split('\n')[0].trim()

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
        process.stdout.write(chalk.reset(EOL))
        error = error || report.errors.length > 0
      }
      process.exit(error ? -1 : 0)
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(err)
      process.exit(-1)
    }
  })

cli.help()
cli.version(version)
cli.parse()

// const cli = meow(
//   `
//   Usage: standard-commitlint [options...]

//   Where <options> is one of:

//     -f --from
//     lower end of the commit range to lint.

//     -t --to
//     upper end of the commit range to lint.

//   Exemple:

//     standard-commitlint --from origin/master
//   `,
