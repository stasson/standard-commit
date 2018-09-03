import * as execa from 'execa'

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

export async function gitCanCommit(...args) {
  try {
    return (await execa('git', ['commit', ...args, '--dry-run'])).code === 0
  } catch (err) {
    process.stdout.write(err.stdout)
    return false
  }
}
