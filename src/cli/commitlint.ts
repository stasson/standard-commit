import meow from 'meow'
import chalk from 'chalk'
import { EOL } from 'os'
import { commitRead, loadConfig, commitLint, commitFormatReport } from '../lib'

const cli = meow(
  `
  Usage: standard-commitlint [options...]

  Where <options> is one of:

    -f --from         
    lower end of the commit range to lint.
    
    -t --to     
    upper end of the commit range to lint.   

  Exemple:

    standard-commitlint --from origin/master
  `,
  {
    description: 'standard-commitlint',
    flags: {
      from: {
        type: 'string',
        alias: 'f',
        default: null
      },
      to: {
        type: 'string',
        alias: 't',
        default: null
      }
    }
  }
)

async function commitHook() {
  try {
    let error = false
    const edit: string = process.env.GIT_PARAMS || '.git/COMMIT_EDITMSG'
    const load = loadConfig()
    const { from, to } = cli.flags
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
}

commitHook()
