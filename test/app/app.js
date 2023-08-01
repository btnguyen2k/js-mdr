import {mdr} from '../../src/index.js'

const inputs = ['This is a \\nstring', 'Not Katex: \\$a = b + c', 'Also not Katex: \\$a = b + c$']
const opts = {katex: true}
for (const input of inputs) {
  console.log(`Input: ${input}\nResult: ${mdr(input, opts)}`)
}
