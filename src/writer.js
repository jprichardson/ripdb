import assert from 'assert'
import cfs from 'cfs'
import moment from 'moment'
import path from 'path'
import ymd from 'ymd'

// TODO: need to find a way to get time field as data to path resolver is a buffer
let prfn = (baseDir) => (data, encoding) => {
  // TODO: this sucks for performance
  let da = JSON.parse(data)
  let d = ymd(new Date(da.t))
  let dir = path.join(baseDir, d.year, d.month)

  return path.join(dir, d.ymd + '.ndjson')
}

export default function createWriter (dbDir, indexFn = prfn(dbDir)) {
  let writer = cfs.createWriteStream(indexFn, { flags: 'a+' })

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
