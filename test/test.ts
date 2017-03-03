import 'typings-global'

import * as smartava from '../dist/index'
import * as path from 'path'
import * as gulp from 'gulp'
import * as smartq from 'smartq'
import * as gulpFunction from 'gulp-function'

let mySmartava = new smartava.Smartava()

let testAblesReady = smartq.defer()
let testFilesReady = smartq.defer()

gulp.src(path.join(__dirname, 'testablefiles/**/*.js'))
  .pipe(mySmartava.pipeTestableFiles())
  .pipe(gulpFunction.atEnd(async () => {
    testAblesReady.resolve()
  }))

gulp.src(path.join(__dirname, 'testfiles/**/*.js'))
  .pipe(mySmartava.pipeTestFiles())
  .pipe(gulpFunction.atEnd(async () => {
    testFilesReady.resolve()
  }))

Promise.all([testAblesReady.promise, testFilesReady.promise])
  .then(() => {
    console.log('ready')
    mySmartava.runTests()
  })

console.log('hi')
