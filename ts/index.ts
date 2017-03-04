import 'typings-global'
import * as smartinject from 'smartinject'
import * as smartipc from 'smartipc'
import * as gulpFunction from 'gulp-function'
import * as path from 'path'
import * as smartq from 'smartq'

import { Transform } from 'stream'

/**
 * Smartava class allows the setup of tests
 */
export class TabBuffer {
  testableFiles: smartinject.fileObject[] = []
  testFiles: smartinject.fileObject[] = []
  testThreads: smartipc.Thread[]
	/**
	 * the constructor of class Smartava
	 */
  constructor() {

  }

  /**
   * accepts a gulp strams of files to test.
   * Each file is expected to be a module
   * You may transpile them beforehand 
   */
  pipeTestableFiles() {
    return gulpFunction.forEach(async (file) => {
      this.testableFiles.push(file)
    })
  }

  /**
   * accepts a gulp stream of test files
   * each test file is spawned as subprocess to speed up test execution.
   * Each spawned test file wile yet get injected any files to test
   */
  pipeTestFiles() {
    return gulpFunction.forEach(async (file) => {
      this.testFiles.push(file)
    })
  }

  /**
   * runs tests and returns coverage report
   */
  runTests () {
    let done = smartq.defer()
    let testableMessageFiles: any = {}
    for (let file of this.testableFiles) {
      testableMessageFiles[file.path] = file.contents.toString()
    }
    let threadMessage = JSON.stringify(testableMessageFiles)
    smartipc.startSpawnWrap(path.join(__dirname, 'spawnhead.js'),[],{'SMARTINJECT': threadMessage})
    let testPromiseArray: Promise<any>[] = []
    for (let testFile of this.testFiles) {
      let testThread = new smartipc.Thread(testFile.path)
      let testPromise = testThread.sendOnce({}).then((message) => {}).catch(err => {
        console.log('wow error:')
        console.log(err)
      })
      testPromiseArray.push(testPromise)
    }
    Promise.all(testPromiseArray).then(() => {
      done.resolve()
    })
    return done.promise
  }
}
