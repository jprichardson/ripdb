Winkle
======

[![build status](https://api.travis-ci.org/jprichardson/winkle.svg)](http://travis-ci.org/jprichardson/winkle)
[![windows build status](https://ci.appveyor.com/api/projects/status/github/jprichardson/winkle?branch=master&svg=true)](https://ci.appveyor.com/project/jprichardson/winkle/branch/master)

A 100% JavaScript embeddable time series database.


### Name

The name "Winkle" is from [Rip Van Winkle](https://en.wikipedia.org/wiki/Rip_Van_Winkle).


### Why?

Often times it's useful to have data indexed by date/time. Examples of such data would be
log data, stock data, etc. There are plenty of time series databases, however, none that
I'm aware of that are embeddable.


### Design Goals

- No native modules, 100% embeddable.
- Super simple file format. Indexed (typically by day) newline delimited JSON (.ndjson) with two top level fields
`d`, and `t`.
- Simple interface. Node.js streams only to read or write.


### Caveat Emptor

I don't maintain that this is a good idea, nor is even fast/efficient. This should be thought of as
more of an experiment. If your data set is larger than 100 MB, you may be better served
by another embeddable database or time series database.


Usage
-----

### Install

    npm i --save winkle


### API

#### create()

create(path, [indexFn])

**Parameters:**
- `path`: The path directory to read / write a Winkle database.
- `indexFn`: Optional function to use for indexing. Defaults to returning a path that indexes
like `${path}/YYYY/mm-dd.ndjson`. Files should easily fit in memory.

**Returns:** An instance of Winkle.

```js
var winkle = require('winkle')
var db = winkle.create('~/data/stocks')
```

#### prototype.path

#### prototype.createReader()

Returns an instance of [Readable stream](https://nodejs.org/api/stream.html#stream_class_stream_readable) used to read data
from the database. Start

```js
var winkle = require('winkle')
var db = winkle.create('~/data/stocks')
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
var winkle = require('winkle')
var db = winkle.create('~/data/stocks')
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
