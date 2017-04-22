import * as plugins from './tapbuffer.plugins'

import { Transform } from 'stream'

let tapMochaReporter = require('tap-mocha-reporter')

/**
 * Smartava class allows the setup of tests
 */
export class TabBuffer {
  testableFiles: plugins.smartinject.fileObject[] = []
  testFiles: plugins.smartinject.fileObject[] = []
  testThreads: plugins.smartipc.Thread[]
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
    return plugins.gulpFunction.forEach(async (file) => {
      this.testableFiles.push(file)
    })
  }

  /**
   * accepts a gulp stream of test files
   * each test file is spawned as subprocess to speed up test execution.
   * Each spawned test file wile yet get injected any files to test
   */
  pipeTestFiles() {
    return plugins.gulpFunction.forEach(async (file) => {
      this.testFiles.push(file)
    })
  }

  /**
   * runs tests and returns coverage report
   */
  runTests(): Promise<string> {
    let done = plugins.smartq.defer<string>()

    // print some info
    plugins.beautylog.log(
      `---------------------------------------------\n`
      + `-------------------- tapbuffer ----------------------\n`
      + `-----------------------------------------------------`
    )
    plugins.beautylog.info(`received ${this.testableFiles.length} modulefile(s) for testing`)
    plugins.beautylog.info(`received ${this.testFiles.length} test files`)
    plugins.beautylog.info(`Coverage will be provided by istanbul`)

    // handle testableFiles
    let testableFilesMessage: any = {}
    for (let file of this.testableFiles) {
      testableFilesMessage[ file.path ] = file.contents.toString()
    }

    // handle testFiles
    let testFilesMessage: any = {}
    for (let file of this.testFiles) {
      testFilesMessage[ file.path ] = file.contents.toString()
    }

    // prepare injection handoff
    let testableFilesJson = JSON.stringify(testableFilesMessage)
    let testFilesJson = JSON.stringify(testFilesMessage)
    let parentEnv = JSON.stringify(process.env)
    plugins.smartipc.startSpawnWrap(plugins.path.join(__dirname, 'spawnhead.js'), [], {
      'TESTABLEFILESJSON': testableFilesJson,
      'TESTFILESJSON': testFilesJson,
      'PARENTENV': parentEnv
    })
    let testPromiseArray: Promise<any>[] = []
    let testCounter = 0
    for (let testFile of this.testFiles) {
      testCounter++
      let testThread = new plugins.smartipc.ThreadSimple(testFile.path,[], { silent: true, env: {TESTNUMBER: `${testCounter.toString()}`} })
      let testPromise = testThread.run().then((childProcess) => {
        let done = plugins.smartq.defer()
        childProcess.stdout.pipe(
          tapMochaReporter('list')
        )
        childProcess.on('exit', function () {
          done.resolve()
        })
        return done.promise
      })
      testPromiseArray.push(testPromise)
    }
    Promise.all(testPromiseArray).then(async () => {
      let Collector = new plugins.istanbul.Collector()
      let Reporter = new plugins.istanbul.Reporter()
      let fileArray = await plugins.smartfile.fs.fileTreeToObject(process.cwd(), 'coverage/**/coverage-final.json')
      for (let smartfile of fileArray) {
        Collector.add(JSON.parse(smartfile.contents.toString()))
      }
      Reporter.addAll(['text','lcovonly'])
      Reporter.write(Collector, true, () => {
        let lcovInfo: string = plugins.smartfile.fs.toStringSync(plugins.path.join(process.cwd(), 'coverage/lcov.info'))
        plugins.smartfile.fs.removeSync(plugins.path.join(process.cwd(), 'coverage'))
        done.resolve(lcovInfo)
      })
    }).catch(err => {
      console.log(err)
    })
    return done.promise
  }
}
