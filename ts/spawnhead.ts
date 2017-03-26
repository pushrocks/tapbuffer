// This file gets executed beforehand in every child spawned

import * as smartinject from 'smartinject'
import * as path from 'path'

let testNumber = parseInt(process.env.TESTNUMBER, 10)

let istanbul = require('istanbul')

let localInstrumenter = new istanbul.Instrumenter({
  coverageVariable: '__coverage__',
  instrumenter: istanbul.Instrumenter
})
let localCollector = new istanbul.Collector()
let localReporter = new istanbul.Reporter(null, `coverage/test-${testNumber}`)

// handle testableFiles
let testableFilesToInject = JSON.parse(process.env.TESTABLEFILESJSON)
let fileArray: smartinject.fileObject[] = []
for (let key in testableFilesToInject) {
  let fileContentString: string = testableFilesToInject[key]
  let fileInstrumented: string = localInstrumenter.instrumentSync(fileContentString, key)
  let fileContentsBuffer = new Buffer(fileInstrumented)

  // push it to fileArray
  fileArray.push({
    path: key,
    contents: fileContentsBuffer
  })
}

// handleTestFiles
let testFilesToInject = JSON.parse(process.env.TESTFILESJSON)
for (let key in testFilesToInject) {
  let fileContentString: string = testFilesToInject[key]
  let fileContentsBuffer = new Buffer(fileContentString)

  // push it to fileArray
  fileArray.push({
    path: key,
    contents: fileContentsBuffer
  })
}

smartinject.injectFileArray(fileArray)

process.on('exit', function () {
  localCollector.add(global['__coverage__'])
  localReporter.add('json')
  localReporter.write(localCollector, true, () => {
  })
})

require('spawn-wrap').runMain()
