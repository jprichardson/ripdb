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

var _ymd3 = require('ymd');

var _ymd4 = _interopRequireDefault(_ymd3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const defaultIndexFn = date => {
  (0, _assert2.default)(date instanceof Date, 'must pass date');

  var _ymd2 = (0, _ymd4.default)(date);

  let year = _ymd2.year;
  let month = _ymd2.month;
  let _ymd = _ymd2._ymd;

  return _path2.default.join(year, month, _ymd + '.ndjson');
};

let prfn = (baseDir, indexFn) => (data, encoding) => {
  // TODO: this sucks for performance
  let da = JSON.parse(data);
  let file = indexFn((0, _moment2.default)(da.t, [_moment2.default.ISO_8601]).toDate());
  return _path2.default.join(baseDir, file);
};

function createWriter(dbDir) {
  let indexFn = arguments.length <= 1 || arguments[1] === undefined ? defaultIndexFn : arguments[1];

  const cfsFn = prfn(dbDir, indexFn);
  let writer = _cfs2.default.createWriteStream(cfsFn, { flags: 'a+' });

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