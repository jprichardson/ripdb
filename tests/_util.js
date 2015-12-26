import assert from 'assert'
import fs from 'fs-extra'
import ms from 'ms'
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

export const trimMillis = (date) => new Date(Math.round(date.getTime() / 1000) * 1000)

export const dateRange = (n, { noMillis = true, end = new Date(), span = ms('10 years') } = {}) => {
  if (noMillis) end = trimMillis(end)
  let start = new Date(end.getTime() - span)
  if (noMillis) start = trimMillis(start)
  const step = span / n
  if (noMillis) assert(step > 1000, 'when trimMillis, there must be enough time elapsed to be greater than 1 second between dates')

  let dates = []
  for (let k = start.getTime(); k < end.getTime(); k += step) {
    let newDate = new Date(k)
    if (noMillis) newDate = trimMillis(newDate)
    dates.push(newDate)
  }

  return dates
}
