'use strict'

const gulp = require('gulp')
const $ = require('gulp-load-plugins')()

const srcIncludes = [
  '**/*.js',
  '!node_modules/**',
  '!coverage/**',
  '!test/**' // tests can be wonky
]

gulp.task('lint', function lintTask () {
  return gulp
    .src(srcIncludes)
    .pipe($.standard())
    .pipe($.standard.reporter('default', {breakOnError: true}))
})

gulp.task('pre-test', function preTest () {
  return gulp
    .src(srcIncludes)
    .pipe($.istanbul())
    .pipe($.istanbul.hookRequire())
})

gulp.task('test', ['lint', 'pre-test'], function testTask () {
  return gulp
    .src(['test/*.js'])
    .pipe($.mocha({ui: 'qunit', reporter: 'min'}))
    .pipe($.istanbul.writeReports())
})

gulp.task('doc', function gendoc () {
  return gulp
    .src(['index.js'])
    .pipe($.concat('api.md'))
    .pipe($.jsdocToMarkdown())
    .on('error', (err) => console.error('jsdoc2md failed: %s', err.message))
    .pipe(gulp.dest('.'))
})

gulp.task('default', ['test'])
