import fs from 'fs-extra'
import ospath from 'ospath'
import path from 'path'

export function setup () {
  var testdir = path.join(ospath.tmp(), 'tests', 'ripdb', Date.now().toString())
  return testdir
}

export function teardown (dir, callback) {
  // remove sync sucks on Windows, so we use async
  fs.remove(dir, callback)
}
