import * as execa from 'execa'

export async function gitUnstagedPaths() {
  try {
    const git = await execa.stdout('git', ['diff', '--cached', '--name-only'])
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
