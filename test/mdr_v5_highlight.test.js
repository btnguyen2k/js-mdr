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
  {
    input: '```plain\na<b\n```',
    expectedResult: '<pre><code class="hljs language-plain">a&lt;b\n</code></pre>',
    description: 'plaintext',
  },
  {
    input: '```\na>b\n```',
    expectedResult: '<pre><code class="hljs language-plaintext">a&gt;b\n</code></pre>',
    description: 'plaintext is default',
  },
  {
    input: '```\na>b\n```',
    expectedResult: '<pre><code class="hljs language-plaintext">a&gt;b\n</code></pre>',
    description: 'custom highlighter',
    opts: {
      highlight(code, lang) {
        return code
      }
    }
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
