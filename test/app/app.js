import {mdr} from '../../src/index.js'

const md = '# heading 1\n\n## heading 2'
const opts = {headerIds: true, headerPrefix: 'h-'}
console.log(mdr(md, opts))
