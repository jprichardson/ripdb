'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createWriter;

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _cfs = require('cfs');

var _cfs2 = _interopRequireDefault(_cfs);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _ymd = require('ymd');

var _ymd2 = _interopRequireDefault(_ymd);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: need to find a way to get time field as data to path resolver is a buffer
let prfn = baseDir => (data, encoding) => {
  // TODO: this sucks for performance
  let da = JSON.parse(data);
  let d = (0, _ymd2.default)(new Date(da.t));
  let dir = _path2.default.join(baseDir, d.year, d.month);

  return _path2.default.join(dir, d.ymd + '.ndjson');
};

function createWriter(dir) {
  let writer = _cfs2.default.createWriteStream(prfn(dir), { flags: 'a+' });

  let oldWrite = writer.write;
  writer.write = function (_ref) {
    let t = _ref.t;
    let d = _ref.d;

    (0, _assert2.default)(typeof t !== 'undefined', 'time must be defined');
    (0, _assert2.default)(typeof d !== 'undefined', 'd must defined');

    let ts = (0, _moment2.default)(t).format();
    let record = { t: ts, d };
    let jsonStr = JSON.stringify(record);
    return oldWrite.call(writer, jsonStr + '\n');
  };

  return writer;
}