import {mdr} from '../../src/index.js'

// const testCases = [
//   {
//     input: '```javascript\n```',
//     expectedResult: '<pre><code class="hljs language-javascript">\n</code></pre>',
//     description: 'code highlight on by default',
//   },
//   {
//     input: '```go\n```',
//     expectedResult: '<pre><code class="l-go">\n</code></pre>',
//     description: 'code highlight with custom langPrefix',
//     opts: {langPrefix: 'l-'}
//   },
//   {
//     input: '```plain\na<b\n```',
//     expectedResult: '<pre><code class="hljs language-plain">a&lt;b\n</code></pre>',
//     description: 'plaintext',
//   },
//   {
//     input: '```\na>b\n```',
//     expectedResult: '<pre><code class="hljs language-plaintext">a&gt;b\n</code></pre>',
//     description: 'plaintext is default',
//   },
//   {
//     input: '```\na>b\n```',
//     expectedResult: '<pre><code class="hljs language-plaintext">a&gt;b\n</code></pre>',
//     description: 'custom highlighter',
//     opts: {
//       highlight(code, lang) {
//         return code
//       }
//     }
//   },
// ]
//
// testCases.forEach((tc) => {
//   const output = mdr(tc.input, tc.opts)
//   console.log(tc.description, output)
//   console.log('--------------------------------------------------')
// })

const input1 = '# heading A\n## heading A.1\n## heading A.2\n# heading B'
const opts1 = {
  headerIds: false,
  toc_container: []
}
console.log(mdr(input1, opts1))
console.log(opts1.toc_container)

const input2 = '# heading A\n# heading B'
const opts2 = {
  headerIds: false,
  tocContainer: []
}
console.log(mdr(input2, opts2))
console.log(opts1.toc_container)
console.log(opts2.toc_container)
