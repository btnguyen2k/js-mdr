import {mdr} from '../../src/index.js'

const md = '```javascript\n```'
console.log(mdr(md, {langPrefix: 'l-'}))
