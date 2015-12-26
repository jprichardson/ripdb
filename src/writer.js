import assert from 'assert'
import cfs from 'cfs'
import moment from 'moment'
import path from 'path'
import ymd from 'ymd'

const defaultIndexFn = (date) => {
  assert(date instanceof Date, 'must pass date')
  let { year, month, _ymd } = ymd(date)
  return path.join(year, month, _ymd + '.ndjson')
}

let prfn = (baseDir, indexFn) => (data, encoding) => {
  // TODO: this sucks for performance
  let da = JSON.parse(data)
  let file = indexFn(moment(da.t, [moment.ISO_8601]).toDate())
  return path.join(baseDir, file)
}

export default function createWriter (dbDir, indexFn = defaultIndexFn) {
  const cfsFn = prfn(dbDir, indexFn)
  let writer = cfs.createWriteStream(cfsFn, { flags: 'a+' })

  let oldWrite = writer.write
  writer.write = function ({ t, d }) {
    assert(typeof t !== 'undefined', 'time must be defined')
    assert(typeof d !== 'undefined', 'd must defined')

    let ts = moment(t).format()
    let record = { t: ts, d }
    let jsonStr = JSON.stringify(record)
    return oldWrite.call(writer, jsonStr + '\n')
  }

  return writer
}
