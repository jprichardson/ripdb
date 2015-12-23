import createReader from './reader'
import createWriter from './writer'

export default class RipDB {
  static create (path, indexFn) {
    return new RipDB(path, indexFn)
  }

  constructor (path, indexFn) {
    this._path = path
    this._indexFn = indexFn
    this._writer = createWriter(path)
  }

  createReader () {
    return createReader(this._path)
  }

  createWriter () {
    return this._writer
  }

  get path () {
    return this._path
  }
}
