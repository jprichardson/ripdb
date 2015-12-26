'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createReader;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _klaw = require('klaw');

var _klaw2 = _interopRequireDefault(_klaw);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const pathSorter = (a, b) => a === b ? 0 : a > b ? -1 : 1;
const queueMethod = 'shift';

// TODO: many efficiency improvements
function createReader(dbDir) {
  let throughStream = _through2.default.obj(function (fileItem, enc, next) {
    if (_path2.default.extname(fileItem.path) !== '.ndjson') return next();
    let self = this;
    _fs2.default.readFile(fileItem.path, 'utf8', (err, data) => {
      if (err) return self.emit(err);
      let lines = data.trim().split('\n').map(v => JSON.parse(v)).map(v => _extends({}, v, { t: (0, _moment2.default)(v.t, [_moment2.default.ISO_8601]).toDate(), f: _path2.default.relative(dbDir, fileItem.path) }));

      lines.sort((r1, r2) => {
        if (r1.t.getTime() === r2.t.getTime()) return 0;else if (r1.t > r2.t) return -1;else return 1;
      });

      lines.forEach(val => self.push(val));
      next();
    });
  });

  return (0, _klaw2.default)(dbDir, { pathSorter, queueMethod }).on('error', function (err) {
    throughStream.emit('error', err); // forward errors
  }).pipe(throughStream);
}