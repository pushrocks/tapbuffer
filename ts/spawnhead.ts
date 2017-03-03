// This file gets executed beforehand in every child spawned

import * as smartinject from 'smartinject'

export default (input, done) => {
    console.log(input)
}

