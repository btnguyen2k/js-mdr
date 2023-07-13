import * as assert from 'assert'
import {mdr} from '../src/index.js'

const testCases = [
  {
    input: 'my email: email@example.com',
    expectedResult: '<p>my email: <a href="mailto:email@example.com">email@example.com</a></p>\n',
    description: 'mangle: false',
    opts: {mangle: false}
  },
  {
    input: 'my email: email@example.com',
    expectedResult: '^<p>my email: <a href="mailto:(&#x?[\\da-f]+;)*">(&#x?[\\da-f]+;)*</a></p>\n$',
    description: 'mangle: true',
    opts: {mangle: true},
    regexp: true,
  },
]

describe('mdr_v5_mangle', () => {
  testCases.forEach((tc) => {
    it(tc.description, () => {
      const opts = tc.opts ? tc.opts : {}
      const output = mdr(tc.input, opts)
      if (tc.regexp) {
        const re = new RegExp(tc.expectedResult)
        assert.ok(re.test(output), 'output not matched expected one')
      } else {
        assert.equal(output, tc.expectedResult)
      }
    })
  })
})
