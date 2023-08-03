import {JSDOM} from 'jsdom'
import {mdr} from '../src/index.js'
import katex from 'katex'
import {compare} from 'dom-compare'

const kopts = {output: 'html', throwOnError: false, displayMode: true}

const testCases = [
  {
    input: '```katex\nx^2 + y^2 = z^2\n```',
    expectedResult: `${katex.renderToString('x^2 + y^2 = z^2', kopts)}\n`,
    description: 'Katex block',
    opts: {katex_opts: kopts}
  },
]

describe('mdr_katex_block', () => {
  testCases.forEach((tc) => {
    it(tc.description, () => {
      const output = mdr(tc.input, tc.opts)
      const window = new JSDOM().window
      const outputNode = new window.DOMParser().parseFromString(output, 'text/html')
      const expectedNode = new window.DOMParser().parseFromString(tc.expectedResult, 'text/html')
      const result = compare(outputNode, expectedNode)
      if (!result.getResult()) {
        console.log('Expected:', tc.expectedResult)
        console.log('Received:', output)
      }
      expect(result.getResult()).toBe(true)
    })
  })
})
