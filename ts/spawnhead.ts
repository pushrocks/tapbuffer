// This file gets executed beforehand in every child spawned

import * as smartinject from 'smartinject'

let filesToInject = JSON.parse(process.env.SMARTINJECT)
let fileArray: smartinject.fileObject[] = []
for (let key in filesToInject) {
  fileArray.push({
    path: key,
    contents: new Buffer(filesToInject[key])
  })
}

smartinject.injectFileArray(fileArray)

require('spawn-wrap').runMain()
