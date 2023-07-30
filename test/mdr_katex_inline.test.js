import {JSDOM} from 'jsdom'
import {mdr} from '../src/index.js'
import katex from 'katex'

const kopts = {output: 'html', throwOnError: false, displayMode: false}

const testCases = [
  {
    input: 'This is Katex: $x^2 + y^2 = z^2$ and this is not: $x^2 + y^2 = z^2',
    expectedResult: `<p>This is Katex: ${katex.renderToString('x^2 + y^2 = z^2', kopts)} and this is not: $x^2 + y^2 = z^2</p>\n`,
    description: 'Katex and non-Katex in single line',
    opts: {katex_opts: kopts}
  },
  {
    input: 'This is multi-Katex case: $x^2$ + $y^2$ = $z^2$ and this is not: $x^2 + y^2 = z^2',
    expectedResult: `<p>This is multi-Katex case: ${katex.renderToString('x^2', kopts)} + ${katex.renderToString('y^2', kopts)} = ${katex.renderToString('z^2', kopts)} and this is not: $x^2 + y^2 = z^2</p>\n`,
    description: 'multi-Katex in single line',
    opts: {katex_opts: kopts}
  },
  {
    input: '$\\ce{2H2 + O2 -> H2O}$',
    expectedResult: `<p>${katex.renderToString('\\ce{2H2 + O2 -> H2O}', kopts)}</p>\n`,
    description: 'the whole string is Katex',
    opts: {katex_opts: kopts}
  },
  {
    input: 'This is not Katex \\$a = b + c$',
    expectedResult: '<p>This is not Katex \\$a = b + c$</p>\n',
    description: 'inline Katex must start with $',
  },
  {
    input: 'This is also not Katex $$\na= b + c\n$$',
    expectedResult: '<p>This is also not Katex $$\na= b + c\n$$</p>\n',
    description: 'double $ is not valid inline Katex',
  },
]

describe('mdr_katex', () => {
  testCases.forEach((tc) => {
    it(tc.description, () => {
      const output = mdr(tc.input, tc.opts)
      const window = new JSDOM().window
      const outputNode = new window.DOMParser().parseFromString(output, 'text/html')
      const expectedNode = new window.DOMParser().parseFromString(tc.input, 'text/html')
      expect(outputNode.isEqualNode(expectedNode))
    })
  })
})
