import {mdr} from '../src/index.js'

const testCases = [
  {
    input: '<exec>alert(1)</exec>\n<a src="data:text/html;charset=utf-8,a string">my link</a>\n<hr myattr="my-value" />',
    expectedResult: '<exec>alert(1)</exec>\n<a src="data:text/html;charset=utf-8,a string">my link</a>\n<hr myattr="my-value" />',
    description: 'safety off',
    opts: {inline: true, safety: false}
  },
]

describe('mdr_katex', () => {
  testCases.forEach((tc) => {
    it(tc.description, () => {
      const output = mdr(tc.input, tc.opts)
      expect(output).toEqual(tc.expectedResult)
    })
  })
})
