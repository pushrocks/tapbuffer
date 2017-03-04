let {tap, expect} = require('tapbundle')

let my = require('../testablefiles/testproject.js')

let hey = 'wow'

tap.test('sometest',{}, function(test){
    console.log(hey)
    test.end()
})

tap.test('sometest2',{}, function(test){
    console.log('howdy')
    test.end()
})