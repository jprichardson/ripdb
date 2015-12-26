import test from 'tape'
import deepEqual from 'deep-equal'
import sortby from 'lodash.sortby'
import RipDB from '../../'
import { setup, teardown, dateRange } from '../_util'
import streamify from 'stream-array'
import toArray from 'stream-to-array'
import ymd from 'ymd'
import path from 'path'

const N = 10000

function createFixture () {
  return sortby(dateRange(N)
    .map((v, i) => ({ t: v })), 't')
    .map((v, i) => ({ ...v, d: i }))
}

test('write a bunch of records using an indexFn and then sequentially read them all', function (t) {
  t.plan(4)
  let testDir = setup()
  console.log(testDir)
  const fixture = createFixture()
  t.is(fixture.length, N, `fixture length is ${N}`)

  let indexFn = (date) => {
    let { year, month } = ymd(date)
    return path.join(year, month + '.ndjson')
  }

  let db = RipDB.create(testDir, indexFn)
  let writer = db.createWriter()

  streamify(fixture).pipe(writer)
  .on('error', (err) => teardown(testDir, () => t.end(err)))
  .on('finish', () => {
    let reader = db.createReader()
    toArray(reader, (err, results) => {
      t.ifError(err, 'no error')
      t.is(results.length, N, `results length is ${N}`)

      // come out most recent first
      ;[].reverse.call(results)

      let res = results.every((rec, i) => (
        rec.t.getTime() === fixture[i].t.getTime() && deepEqual(rec.d, results[i].d)
      ))

      t.true(res, 'input same as output')

      teardown(testDir, t.end)
    })
  })
})
