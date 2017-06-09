let {tap, expect} = require('tapbundle')

let my = require('../testablefiles/testproject.js')

let hey = 'wow'

tap.test('sometest', async (tools) => {
  console.log(hey)
})

tap.test('sometest2', async (tools) => {
    console.log('howdy')
})

tap.start()
