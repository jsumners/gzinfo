'use strict'

const Buffer = require('safe-buffer')
const fs = require('fs')

/**
 * @prop {string} signature The "magic" bytes of the header in hex format.
 * @prop {int} compressionMethod Value representing the compression method used.
 * @prop {int} flags Bit field indicating various flags set on the file.
 * @prop {Date} lastModified The date and time when the file was compressed.
 * @prop {int} extraFlags Bit field denoting extra information about the file.
 * @prop {int} operatingSystem Indicates the OS used to create the file.
 * @typedef {object} HeaderInfo
 */

/**
 * @prop {int} crc32 Checksum value for the compressed data.
 * @prop {int} uncompressedSize The size, in bytes, of the uncompressed data.
 * @typedef {object} FooterInfo
 */

/**
 * Reads information about a gzipped file. Such information includes:
 *
 * + level of compression used
 * + date when the compression was performed
 * + uncompressed size of the data
 *
 * The information is read *synchronously*.
 *
 * @prop {HeaderInfo} header Parsed details from the header.
 * @prop {FooterInfo} footer Parsed details from the footer.
 * @prop {Buffer} headerBuffer Raw header data.
 * @prop {Buffer} footerBuffer Raw footer data.
 * @prop {Stats} stats Information about the file gleaned from `fs.stat`.
 * @prop {int} crc32 Convenience property for `footer.crc32`.
 * @prop {int} compressedSize Convenience property for `stats.size`.
 * @prop {int} uncompressedSize Convenience property for `footer.uncompressedSize`.
 *
 * @param {string} file Path to a gzipped file to read.
 * @constructor
 */
function GZInfo (file) {
  this.file = file

  try {
    this.stats = fs.statSync(file)
  } catch (e) {
    console.error('could not initialize GZInfo: %s', e.message)
    throw e
  }

  this.headerBuffer = Buffer.alloc(10)
  this.footerBuffer = Buffer.alloc(8)

  this.header = {
    signature: '',
    compressionMethod: -1,
    flags: -1,
    lastModified: new Date(),
    extraFlags: -1,
    operatingSystem: -1
  }

  this.footer = {
    crc32: -1,
    uncompressedSize: -1
  }

  this.readHeader()
  this.readFooter()
}

/**
 * Used to parse the header information. It populates the
 * `headerBuffer` and `header` properties of the object.
 *
 * @private
 */
GZInfo.prototype.readHeader = function readHeader () {
  try {
    const fd = fs.openSync(this.file, 'r')
    fs.readSync(fd, this.headerBuffer, 0, 10, 0)
    fs.close(fd)

    this.header.signature = this.headerBuffer.slice(0, 2).toString('hex')
    if (this.header.signature !== '1f8b') throw new Error('not a gzip file')
    this.header.compressionMethod = this.headerBuffer.readUIntLE(2, 1)
    this.header.flags = this.headerBuffer.readUIntLE(3, 1)
    this.header.lastModified = new Date(this.headerBuffer.readUIntLE(4, 4) * 1000)
    this.header.extraFlags = this.headerBuffer.readUIntLE(8, 1)
    this.header.operatingSystem = this.headerBuffer.readUIntLE(9, 1)
  } catch (e) {
    console.error('could not read headerBuffer: %s', e.message)
    throw e
  }
}

/**
 * Used to parse the footer information. It populates the
 * `footerBuffer` and `footer` properties of the object.
 *
 * @private
 */
GZInfo.prototype.readFooter = function readFooter () {
  try {
    const fd = fs.openSync(this.file, 'r')
    fs.readSync(fd, this.footerBuffer, 0, 8, this.stats.size - 8)
    fs.close(fd)

    this.footer.crc32 = this.footerBuffer.readUIntLE(0, 4)
    this.footer.uncompressedSize = this.footerBuffer.readUIntLE(4, 4)
  } catch (e) {
    console.error('could not read footerBuffer: %s', e.message)
    throw e
  }
}

/**
 * Returns whether or not the compressed file is an ASCII file.
 * According to the [manpage](http://linux.die.net/man/1/gzip),
 * this is only supported on "some non-Unix systems." Thus, you'll
 * probably only ever get `false` from this method.
 *
 * @returns {boolean}
 */
GZInfo.prototype.isAciiFile = function isTextFile () {
  return (this.header.flags & GZInfo.FLAGS.ASCII) > 0
}

/**
 * Returns whether or not the header has a CRC16 value. If present,
 * this checksum is only for the header. The checksum for the compressed
 * file is in the footer.
 *
 * @returns {boolean}
 */
GZInfo.prototype.hasCRC16 = function hasCRC16 () {
  return (this.header.flags & GZInfo.FLAGS.CRC16) > 0
}

/**
 * Returns whether or not there is an extra header field with additional
 * information.
 *
 * @returns {boolean}
 */
GZInfo.prototype.hasExtraFlags = function hasExtraFlags () {
  return (this.header.flags & GZInfo.FLAGS.EXTRA) > 0
}

/**
 * Returns whether or not there is an additional header field that contains
 * the original name of the compressed file.
 *
 * @returns {boolean}
 */
GZInfo.prototype.hasOriginalFileName = function hasOriginalFileName () {
  return (this.header.flags & GZInfo.FLAGS.NAME) > 0
}

/**
 * Returns whether or not there is an additional header field that contains
 * a comment about the compressed file.
 *
 * @returns {boolean}
 */
GZInfo.prototype.hasComment = function hasComment () {
  return (this.header.flags & GZInfo.FLAGS.COMMENT) > 0
}

/**
 * Returns whether or not the compressed data is encrypted.
 *
 * @returns {boolean}
 */
GZInfo.prototype.isEncrypted = function isEncrypted () {
  return (this.header.flags & GZInfo.FLAGS.ENCRYPTED) > 0
}

/**
 * Returns whether or not the reserved flags field is set.
 *
 * @returns {boolean}
 */
GZInfo.prototype.hasReservedFlags = function hasReservedFlags () {
  return (this.header.flags & GZInfo.FLAGS.RESERVED) > 0
}

Object.defineProperties(GZInfo.prototype, {
  crc32: {
    get () { return this.footer.crc32 }
  },
  compressedSize: {
    get () { return this.stats.size }
  },
  uncompressedSize: {
    get () { return this.footer.uncompressedSize }
  }
})

/**
 * Constants for verifying the `header.flags` bit field.
 * @type {object}
 */
GZInfo.FLAGS = {
  ASCII: 0x01,
  CRC16: 0x02,
  EXTRA: 0x04,
  NAME: 0x08,
  COMMENT: 0x10,
  ENCRYPTED: 0x20,
  RESERVED: 0xC0
}

/**
 * Constants for verifying the `header.operatingSystem` field.
 * @type {object}
 */
GZInfo.OS = {
  DOS: 0,
  AMIGA: 1,
  VMS: 2,
  UNIX: 3,
  VMCMS: 4,
  ATARI: 5,
  HPFS: 6,
  MACINTOSH: 7,
  ZSYSTEM: 8,
  CPM: 9,
  TOPS20: 10,
  NTFS: 11,
  QDOS: 12,
  ACORN: 13,
  UNKNOWN: 255
}

/**
 * Constants for validating the `header.compressionMethod` field.
 * @type {object}
 */
GZInfo.COMPRESSION_METHOD = {
  DEFLATE: 8
}

module.exports = function gzinfo (file) {
  return new GZInfo(file)
}

module.exports.GZInfo = GZInfo
