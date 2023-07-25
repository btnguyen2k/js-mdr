import {mdr} from '../src/index.js'

const testCases = [
  {
    input: '```javascript\n```',
    expectedResult: '<pre><code class="hljs language-javascript">\n</code></pre>',
    description: 'code highlight on by default',
  },
  {
    input: '```go\n```',
    expectedResult: '<pre><code class="l-go">\n</code></pre>',
    description: 'code highlight with custom langPrefix',
    opts: {langPrefix: 'l-'}
  },
]

describe('mdr_v5_highlight', () => {
  testCases.forEach((tc) => {
    it(tc.description, () => {
      const opts = tc.opts ? tc.opts : {}
      const output = mdr(tc.input, opts)
      expect(output).toEqual(tc.expectedResult)
    })
  })
})
