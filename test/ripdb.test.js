import test from 'tape'
import RipDB from '../'
import { setup, teardown } from './_util'

test('create an instance of RipDB', function (t) {
  let testDir = setup()

  let db = RipDB.create(testDir)
  t.is(db.path, testDir)

  teardown(testDir, t.end)
})
