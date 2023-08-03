import {mdr} from '../../src/index.js'

const input = '```video invalid://file.mp4\n```'
const output = mdr(input)
console.log(output)
