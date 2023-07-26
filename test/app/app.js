import {mdr} from '../../src/index.js'

const md = '```plaintext\na<b\n```'
console.log(mdr(md, {
  highlight(code, lang) {
    return code
  }
}))
