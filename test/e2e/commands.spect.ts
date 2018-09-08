import * as os from 'os'
import * as path from 'path'
import * as fs from 'fs-extra'
import * as execa from 'execa'

describe('commit', () => {
  it('fails on not a repo', () => {
    expect.hasAssertions()

    const tmpPath = path.join(os.tmpdir(), 'not-a-repo')
    fs.mkdirpSync(tmpPath)
    execa.shellSync(' ',{
      cwd: tmpPath
    })
    expect(true).toBeFalsy()
  })
})
