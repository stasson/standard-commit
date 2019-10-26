import execa from 'execa'
import path from 'path'
import fs from 'fs'
import { promisify } from 'util'

const writeFile = promisify(fs.writeFile)

export async function gitStagedPaths() {
  try {
    const args = ['diff', '--name-only', '--cached']
    const git = await execa('git', args)

    const staged = git.stdout
      .split('\n')
      .map(f => f.trim())
      .filter(f => f)

    return staged
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
  return (await git).exitCode
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
  const gitCommit = execa(shellCommand, {
    shell: true
  })
  gitCommit.stdout.pipe(process.stdout)
  gitCommit.stderr.pipe(process.stderr)
  gitCommit.stdin.write(message)
  gitCommit.stdin.end()
  return (await gitCommit).exitCode
}

export async function gitCanCommit(...args) {
  try {
    const dryRun = await execa('git', ['commit', ...args, '--dry-run'])
    return dryRun.exitCode === 0
  } catch (err) {
    process.stdout.write(err.stdout)
    process.stdout.write('\n')
    return false
  }
}

export async function gitTopLevel() {
  // git rev-parse --show-toplevel
  const gitDir = execa('git', ['rev-parse', '--show-toplevel'])
  const gitPath = (await gitDir).stdout.trim()
  return gitPath
}
