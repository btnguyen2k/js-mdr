import {mdr} from '../src/index.js'

const testCases = [
  {
    input: '# heading 1\n\n## heading 2\n\n### heading 3',
    expectedResult: '<h1>heading 1</h1>\n<h2>heading 2</h2>\n<h3>heading 3</h3>\n',
    description: 'no header ids',
    opts: {headerIds: false}
  },
  {
    input: '# heading 1\n\n## heading 2\n\n### heading 3',
    expectedResult: '<h1 id="heading-1">heading 1</h1>\n<h2 id="heading-2">heading 2</h2>\n<h3 id="heading-3">heading 3</h3>\n',
    description: 'header ids on by default',
  },
  {
    input: '# heading 1\n\n## heading 2\n\n### heading 3',
    expectedResult: '<h1 id="h-heading-1">heading 1</h1>\n<h2 id="h-heading-2">heading 2</h2>\n<h3 id="h-heading-3">heading 3</h3>\n',
    description: 'header ids with prefix',
    opts: {headerPrefix: 'h-'}
  },
]

describe('mdr_v5_headerids', () => {
  testCases.forEach((tc) => {
    it(tc.description, () => {
      const opts = tc.opts ? tc.opts : {}
      expect(tc.expectedResult).toEqual(mdr(tc.input, opts))
    })
  })
})
