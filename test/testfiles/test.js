let tap = require('tap')

console.log('howdy')

module.exports = (input, done) => {
    console.log(input)
    done(input)
}