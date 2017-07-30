import * as plugins from './tapbuffer.plugins'
import * as tapbufferConfig from './tapbuffer.config'
export * from './tapbuffer.config'

import { Transform } from 'stream'

let tapMochaReporter = require('tap-mocha-reporter')

// interfaces
import { Smartfile } from 'smartfile'

/**
 * Smartava class allows the setup of tests
 */
export class TabBuffer {
  testableFiles: Smartfile[] = []
  testFiles: Smartfile[] = []
  testThreads: plugins.smartipc.Thread[]
  testConfig: tapbufferConfig.ITapbufferConfig = {
    parallel: true,
    coverage: true
  }

	/**
	 * the constructor of class Smartava
	 */
  constructor () {
    // nothing here
  }

  /**
   * accepts a gulp strams of files to test.
   * Each file is expected to be a module
   * You may transpile them beforehand
   */
  pipeTestableFiles () {
    return plugins.gulpFunction.forEach(async (file) => {
      this.testableFiles.push(file)
    })
  }

  /**
   * accepts a gulp stream of test files
   * each test file is spawned as subprocess to speed up test execution.
   * Each spawned test file wile yet get injected any files to test
   */
  pipeTestFiles () {
    return plugins.gulpFunction.forEach(async (file) => {
      this.testFiles.push(file)
    })
  }

  // allows to set a config
  setConfig (testConfigArg: tapbufferConfig.ITapbufferConfig) {
    this.testConfig = Object.assign(this.testConfig, testConfigArg)
  }
  /**
   * runs tests and returns coverage report
   */
  async runTests (): Promise<string> {
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
    let parentShellPath = (await plugins.smartshell.execSilent(`echo $PATH`)).stdout
    parentShellPath = parentShellPath.replace(/\r?\n|\r/g, '') //  remove end of line
    plugins.smartipc.startSpawnWrap(plugins.path.join(__dirname, 'spawnhead.js'), [], {
      'TESTABLEFILES_JSON': testableFilesJson,
      'TESTFILES_JSON': testFilesJson,
      'PARENT_ENV': parentEnv
    })
    let testPromiseArray: Promise<any>[] = []
    let testCounter = 0
    for (let testFile of this.testFiles) {
      testCounter++
      let testThread = new plugins.smartipc.ThreadSimple(testFile.path, [], { silent: true, env: { TESTNUMBER: `${testCounter.toString()}` } })
      let parsedPath = plugins.path.parse(testFile.path)
      console.log('=======')
      plugins.beautylog.log(`-------------- ${parsedPath.name} --------------`)
      console.log('=======')
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

      // wait for tests to complete if not running parallel
      if (!this.testConfig.parallel) {
        await testPromise
      }
      testPromiseArray.push(testPromise)
    }
    Promise.all(testPromiseArray).then(async () => {
      let Collector = new plugins.istanbul.Collector()
      let Reporter = new plugins.istanbul.Reporter()
      let fileArray = await plugins.smartfile.fs.fileTreeToObject(process.cwd(), 'coverage/**/coverage-final.json')
      if (this.testConfig.coverage) {
        // remap the output
        let remapArray: string[] = []
        for (let smartfile of fileArray) {
          remapArray.push(smartfile.path)
        }
        let remapCoverage = plugins.remapIstanbul_load(remapArray)
        let remappedCollector = plugins.remapIstanbul_remap(remapCoverage, {
          readFile: (filePath: string) => {
            let localSmartfile = this.testableFiles.find(itemArg => {
              if (itemArg.path === filePath) {
                return true
              }
            })
            return localSmartfile.contents.toString()
          }
        })
        let remappedJsonPath = plugins.path.resolve('coverage-final.json')
        await plugins.remapIstanbul_write(remappedCollector, 'json', remappedJsonPath)

        Collector.add(
          plugins.smartfile.fs.toObjectSync(remappedJsonPath)
        )

        await plugins.smartfile.fs.remove(remappedJsonPath)

        Reporter.addAll([ 'text', 'lcovonly' ])
        Reporter.write(Collector, true, () => {
          let lcovInfo: string = plugins.smartfile.fs.toStringSync(plugins.path.join(process.cwd(), 'coverage/lcov.info'))
          plugins.smartfile.fs.removeSync(plugins.path.join(process.cwd(), 'coverage'))
          done.resolve(lcovInfo)
        })
      }
    }).catch(err => {
      console.log(err)
    })
    return await done.promise
  }
}
