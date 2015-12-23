'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _writer = require('./writer');

var _writer2 = _interopRequireDefault(_writer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class RipDB {
  static create(path, indexFn) {
    return new RipDB(path, indexFn);
  }

  constructor(path, indexFn) {
    this._path = path;
    this._indexFn = indexFn;
    this._writer = (0, _writer2.default)(path);
  }

  createReader() {}

  createWriter() {
    return this._writer;
  }

  get path() {
    return this._path;
  }
}
exports.default = RipDB;