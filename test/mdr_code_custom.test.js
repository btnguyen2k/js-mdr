import {mdr} from '../src/index.js'

const testCases = [
  {
    input: '```custom\nhello\n```',
    expectedResult: 'hello A',
    description: 'custom code handler',
    opts: {
      code_handlers: {
        custom: {
          code(code, infoString, escaped) {
            return code + ' A'
          }
        }
      }
    }
  },
  {
    input: '```custom\nhello\n```',
    expectedResult: '<pre><code>hello\n</code></pre>',
    description: 'invalid handler',
    opts: {
      code_handlers: {
        custom: {
          hello(code, infoString, escaped) {
            return code + ' A'
          }
        }
      }
    }
  },
]

describe('mdr_code_custom_handler', () => {
  testCases.forEach((tc) => {
    it(tc.description, () => {
      const output = mdr(tc.input, tc.opts)
      expect(output).toEqual(tc.expectedResult)
    })
  })
})
