import fs from 'fs'
import klaw from 'klaw'
import moment from 'moment'
import path from 'path'
import through2 from 'through2'

const pathSorter = (a, b) => a === b ? 0 : a > b ? -1 : 1
const queueMethod = 'shift'

// TODO: many efficiency improvements
export default function createReader (dbDir) {
  let throughStream = through2.obj(function (fileItem, enc, next) {
    if (path.extname(fileItem.path) !== '.ndjson') return next()
    let self = this
    fs.readFile(fileItem.path, 'utf8', (err, data) => {
      if (err) return self.emit(err)
      let lines = data
        .trim().split('\n')
        .map((v) => JSON.parse(v))
        .map((v) => ({ ...v, t: moment(v.t, [moment.ISO_8601]).toDate(), f: path.relative(dbDir, fileItem.path) }))

      lines.sort((r1, r2) => {
        if (r1.t.getTime() === r2.t.getTime()) return 0
        else if (r1.t > r2.t) return -1
        else return 1
      })

      lines.forEach((val) => self.push(val))
      next()
    })
  })

  return klaw(dbDir, { pathSorter, queueMethod })
    .on('error', function (err) {
      throughStream.emit('error', err) // forward errors
    })
    .pipe(throughStream)
}
