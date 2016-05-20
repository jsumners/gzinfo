# gzinfo

This is a simple module for reading the header and footer information of a
gzip compressed file. With this module you can get information such as the
uncompressed size of the file and the date when the file was compressed.

This module was written using the following references:

+ http://forensicswiki.org/wiki/Gzip
+ http://www.gzip.org/zlib/rfc-gzip.html
+ http://git.savannah.gnu.org/cgit/gzip.git/tree/gzip.h
+ http://git.savannah.gnu.org/cgit/gzip.git/tree/gzip.c

## Install

```sh
$ npm install --production gzinfo
```

## Example

```js
const gzinfo = require('gzinfo')
const fileInfo = gzinfo('/path/to/some/file.gz')
console.log(`uncompressed size of file.gz is ${fileInfo.uncompressedSize} bytes`)
```

## Documentation

The main export is a function `gzinfo(file)`. This is merely a wrapper for the
class `GZInfo(file)`. The wrapper method returns an instance of the class.
The class is exported as `require('gzinfo').GZInfo` if you would like to use
it directly.

The full documentation for the class is in [api.md](api.md).

## License

[MIT License](http://jsumners.mit-license.org/)
