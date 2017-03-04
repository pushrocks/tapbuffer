// This file gets executed beforehand in every child spawned

import * as smartinject from 'smartinject'
import * as path from 'path'

let testNumber = parseInt(process.argv[3], 10)

let istanbul = require('istanbul')

let localInstrumenter = new istanbul.Instrumenter({
  coverageVariable: '__coverage__',
  instrumenter: istanbul.Instrumenter
})
let localCollector = new istanbul.Collector()
let localReporter = new istanbul.Reporter(null, `coverage/test-${testNumber}`)
let filesToInject = JSON.parse(process.env.SMARTINJECT)
let fileArray: smartinject.fileObject[] = []
for (let key in filesToInject) {
  let fileContentString: string = filesToInject[key]
  let fileInstrumented: string = localInstrumenter.instrumentSync(fileContentString, key)
  let fileContents = new Buffer(fileInstrumented)

  // push it to fileArray
  fileArray.push({
    path: key,
    contents: new Buffer(fileContents)
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
