import * as execa from 'execa'
import * as path from 'path'
import * as fs from 'fs'
import { promisify } from 'util'

const writeFile = promisify(fs.writeFile)

export async function gitUnstagedPaths(cached: boolean = false) {
  try {
    const args = cached
      ? ['diff', '--name-only', '--cached']
      : ['diff', '--name-only']

    const git = await execa.stdout('git', args)

    return git
      .split('\n')
      .map(f => f.trim())
      .filter(f => f)
  } catch {
    return []
  }
}

export async function gitCommit(message: string, ...args) {
  const commitArgs = ['commit', ...args, '--file', '-']
  const git = execa('git', commitArgs)
  git.stdout.pipe(process.stdout)
  git.stderr.pipe(process.stderr)
  git.stdin.write(message)
  git.stdin.end()
  return (await git).code
}

export async function gitCommitAndEdit(message: string, ...args) {
  let editPath: string
  try {
    const gitDir = execa('git', ['rev-parse', '--absolute-git-dir'])
    const gitPath = (await gitDir).stdout.trim()
    editPath = path.join(gitPath, 'COMMIT_STDMSG')
    await writeFile(editPath, message)
  } catch (err) {
    process.stdout.write(err.stdout)
    throw err
  }
  const commitArgs = ['commit', ...args, '-e', '-F', JSON.stringify(editPath)]
  const shellCommand = 'git ' + commitArgs.join(' ')
  const gitCommit = execa.shell(shellCommand)
  gitCommit.stdout.pipe(process.stdout)
  gitCommit.stderr.pipe(process.stderr)
  gitCommit.stdin.write(message)
  gitCommit.stdin.end()
  return (await gitCommit).code
}

export async function gitCanCommit(...args) {
  try {
    return (await execa('git', ['commit', ...args, '--dry-run'])).code === 0
  } catch (err) {
    process.stdout.write(err.stdout)
    return false
  }
}
