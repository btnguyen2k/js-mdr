import {mdr} from '../../src/index.js'

// export function extDummy() {
//   return {
//     name: 'code',
//     walkTokens(token) {
//       console.log('[DEBUG]', token)
//     }
//   }
// }

// const md = '```javascript\nconsole.log("Hello World!")\n```'
// const opts = {__extensions: [extDummy()]}
const md = '# heading'
console.log(mdr(md))
