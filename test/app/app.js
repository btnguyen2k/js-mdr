import {mdr} from '../../src/index.js'

const inputs = ['# Hello World!']
for (const input of inputs) {
  console.log(`Input: ${input}\nResult: ${mdr(input)}`)
}
