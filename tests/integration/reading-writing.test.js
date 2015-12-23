import test from 'tape'
import randomdate from 'randomdate'
import sortby from 'lodash.sortby'
import RipDB from '../../'
import { setup, teardown } from '../_util'
import streamify from 'stream-array'
// import toArray from 'stream-to-array'

const N = 10
// 10 years ago, Jan 1st
const start = new Date((new Date()).getFullYear() - 10, 0, 1)

function createFixture () {
  return sortby(Array.from(Array(N))
    .map((v, i) => ({ t: randomdate(start) })), 't')
    .map((v, i) => ({ ...v, d: i }))
}

test('write a bunch of records and then sequentially read them all', function (t) {
  t.plan(10)
  let testDir = setup()
  console.log(testDir)
  const fixture = createFixture()
  t.is(fixture.length, N, `fixture length is ${N}`)

  let db = RipDB.create(testDir)
  let writer = db.createWriter()
  // let reader = db.createReader()

  // fixture.forEach((rec) => writer.write(rec))

  streamify(fixture).pipe(writer)
  .on('error', (err) => teardown(testDir, () => t.end(err)))
  .on('finish', () => {
    console.log('done')
    /* toArray(reader, (err, results) => {
      t.ifError(err, 'no error')
      console.dir(results)
      t.end()
    })*/
  })
})
