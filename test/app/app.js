import {mdr} from '../../src/index.js'

const input = '```custom\nhello\n```'
const opts = {
  code_handlers: {
    custom: {
      code(code, infoString, escaped) {
        return code + ' A'
      }
    }
  }
}

const output = mdr(input, opts)
console.log(output)
