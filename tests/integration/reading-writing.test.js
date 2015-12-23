import test from 'tape'
import randomdate from 'randomdate'
import sortby from 'lodash.sortby'
import RipDB from '../../'
import { setup, teardown } from '../_util'
import streamify from 'stream-array'
import toArray from 'stream-to-array'

const N = 2
// 10 years ago, Jan 1st
const start = new Date((new Date()).getFullYear() - 10, 0, 1)
const trimMillis = (date) => new Date(Math.floor(date.getTime() / 1000) * 1000)

function createFixture () {
  return sortby(Array.from(Array(N))
    .map((v, i) => ({ t: trimMillis(randomdate(start)) })), 't')
    .map((v, i) => ({ ...v, d: i }))
}

test('write a bunch of records and then sequentially read them all', function (t) {
  t.plan(4)
  let testDir = setup()
  console.log(testDir)
  const fixture = createFixture()
  t.is(fixture.length, N, `fixture length is ${N}`)

  let db = RipDB.create(testDir)
  let writer = db.createWriter()

  // fixture.forEach((rec) => writer.write(rec))

  streamify(fixture).pipe(writer)
  .on('error', (err) => teardown(testDir, () => t.end(err)))
  .on('finish', () => {
    let reader = db.createReader()
    toArray(reader, (err, results) => {
      t.ifError(err, 'no error')
      t.is(results.length, N, `results length is ${N}`)

      // come out most recent first
      ;[].reverse.call(results)
      t.same(fixture, results, 'input same as output')

      teardown(testDir, t.end)
    })
  })
})
