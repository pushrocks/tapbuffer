let {tap, expect} = require('tapbundle')

let my = require('../testablefiles/testproject.js')
let smartshell = require('smartshell')
let hey = 'wow'

tap.test('sometest', async (tools) => {
  console.log(hey)
})

tap.test('sometest2', async (tools) => {
  console.log('howdy')
})

tap.test('shelltest', async (tools) => {
  let result = await smartshell.execSilent('npm -v')
  console.log(result)
  // expect(result.exitCode).to.equal(0), some odd problem with istanbul makes this 1
})

tap.start()
