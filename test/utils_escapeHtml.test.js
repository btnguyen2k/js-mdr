import {escapeHtml} from '../src/utils.js'

const testCases = [
  {
    input: '&abc&',
    expectedResult: '&amp;abc&amp;',
    description: 'escape ampersand',
  },
  {
    input: '<abc>',
    expectedResult: '&lt;abc&gt;',
    description: 'escape less-than and greater-than',
  },
  {
    input: '"abc"',
    expectedResult: '&quot;abc&quot;',
    description: 'escape double-quote',
  },
  {
    input: "'abc'",
    expectedResult: '&#39;abc&#39;',
    description: 'escape single-quote',
  },
  {
    input: '`abc`',
    expectedResult: '&#96;abc&#96;',
    description: 'escape backtick',
  },
]

describe('utils_escapeHtml', () => {
  testCases.forEach((tc) => {
    it(tc.description, () => {
      const output = escapeHtml(tc.input)
      expect(output).toEqual(tc.expectedResult)
    })
  })
})
