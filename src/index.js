export default class RipDB {
  static create (path, indexFn) {
    return new RipDB(path, indexFn)
  }

  constructor (path, indexFn) {
    this._path = path
    this._indexFn = indexFn
  }

  createReader () {
    
  }

  createWriter () {

  }

  get path () {
    return this._path
  }
}
