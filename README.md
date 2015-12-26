RipDB
=====

[![build status](https://api.travis-ci.org/jprichardson/ripdb.svg)](http://travis-ci.org/jprichardson/ripdb)
[![windows build status](https://ci.appveyor.com/api/projects/status/github/jprichardson/ripdb?branch=master&svg=true)](https://ci.appveyor.com/project/jprichardson/ripdb/branch/master)
[![npm][https://img.shields.io/npm/v/ripdb.svg?style=flat]][https://npmjs.org/package/ripdb]([![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/))

A 100% JavaScript embeddable JSON time series database.

**API is unstable.**

### Name

The name "Rip" in RipDB is from [Rip Van Winkle](https://en.wikipedia.org/wiki/Rip_Van_Winkle).


### Why?

Often times it's useful to have data indexed by date/time. Examples of such data would be
log data, stock data, etc. There are plenty of time series databases, however, none that
I'm aware of that are embeddable.

RipDB is useful if you're building an [Electron](https://github.com/atom/electron)
app and you don't want to recompile LevelUp for every target platform.


### Design Goals

- No native modules, 100% embeddable.
- Super simple file format. Indexed (typically by day) newline delimited JSON (`.ndjson`) with two top level fields
`d`, and `t`.
- Simple interface. Node.js streams only to read or write.


### Caveat Emptor

I don't maintain that this is a good idea, nor is even fast/efficient. This should be thought of as
more of an experiment. If your data set is larger than 100 MB, you may be better served
by another embeddable database or time series database.


Usage
-----

### Install

    npm i --save ripdb


### API

#### create()

`create(path, [indexFn])`

**Parameters:**
- `path`: The path directory to read / write a RipDB database.
- `indexFn`: Optional function to use for indexing. Defaults to returning a path that indexes
like `${path}/YYYY/mm-dd.ndjson`. Files should easily fit in memory.

**Returns:** An instance of RipDB.

```js
var ripdb = require('ripdb')
var db = ripdb.create('~/data/stocks')
```

#### prototype.path

#### prototype.createReader()

Returns an instance of [Readable stream](https://nodejs.org/api/stream.html#stream_class_stream_readable) used to read data
from the database. Starts from the most recent.

```js
var ripdb = require('ripdb')
var db = ripdb.create('~/data/stocks')
var reader = db.createReader()

reader.on('readable', function () {
  var record = reader.read()
  console.dir(record)
  // => { index: '2015/12-05', t: '2015-12-05T10:36:56-06:00', d: data... }
})
```

Will support middleware, JSON revivers, etc.


#### prototype.createWriter()

Returns an instance of a [Writable stream](https://nodejs.org/api/stream.html#stream_class_stream_writable) used to write data.

```js
var ripdb = require('ripdb')
var db = ripdb.create('~/data/stocks')
var writer = db.createWriter()

writer.write({
  t: new Date() // expected to be instance of Date
  d: { ...data } // your data
})
```

Will support middleware, JSON replacers, etc.


License
-------

MIT

Copyright (c) [JP Richardson](https://github.com/jprichardson)
