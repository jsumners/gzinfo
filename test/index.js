'use strict'
/* eslint-env node, mocha */

const path = require('path')
const expect = require('chai').expect
const gzinfo = require('../')
const readmeGZ = path.join(__dirname, 'fixtures', 'node-readme.md.gz')

test('can read header', function headerTest (done) {
  const gzi = new gzinfo.GZInfo(readmeGZ)
  expect(gzi.header.signature).to.equal('1f8b')
  expect(gzi.header.compressionMethod).to.equal(gzinfo.GZInfo.COMPRESSION_METHOD.DEFLATE)
  expect(gzi.header.lastModified.getTime()).to.equal(1463752388000)

  expect(gzi.isAciiFile()).to.be.false
  expect(gzi.hasCRC16()).to.be.false
  expect(gzi.hasExtraFlags()).to.be.false
  expect(gzi.hasOriginalFileName()).to.be.true
  expect(gzi.hasComment()).to.be.false
  expect(gzi.isEncrypted()).to.be.false
  expect(gzi.hasReservedFlags()).to.be.false

  expect(gzi.header.operatingSystem).to.equal(gzinfo.GZInfo.OS.UNIX)

  done()
})

test('can read footer', function footerTest (done) {
  const gzi = new gzinfo.GZInfo(readmeGZ)
  expect(gzi.crc32).to.equal(340691458)
  expect(gzi.compressedSize).to.equal(5287)
  expect(gzi.uncompressedSize).to.equal(14122)
  done()
})
