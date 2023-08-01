import {mdr, MdrRenderer} from '../src/index.js'

class MyRenderer extends MdrRenderer {
}

const myrenderer = new MyRenderer()

const testCases = [
  {
    input: '```plaintext\na=b\n```',
    expectedResult: '<pre><code class="hljs language-plaintext">a=b\n</code></pre>',
    description: 'custom renderer',
    opts: {renderer: myrenderer}
  },
  {
    input: 'a string',
    expectedResult: '<p>a string</p>\n',
    description: 'undefined options',
  },
  {
    input: 'a string',
    expectedResult: '<p>a string</p>\n',
    description: 'non-object options',
    opts: true,
  },
  {
    input: '**a string**',
    expectedResult: '<strong>a string</strong>',
    description: 'inline',
    opts: {inline: true},
  },
  {
    input: 'a',
    expectedResult: 'a',
    description: 'disable all extensions',
    opts: {inline: true, headerIds: false, mangle: false, safety: false, katex: false, ghgist: false},
  },
]

describe('mdr_others', () => {
  testCases.forEach((tc) => {
    it(tc.description, () => {
      const output = mdr(tc.input, tc.opts)
      expect(output).toEqual(tc.expectedResult)
    })
  })
})
