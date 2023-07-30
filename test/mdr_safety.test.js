import {mdr} from '../src/index.js'

const testCases = [
  {
    input: '<exec>alert(1)</exec>\n<a src="data:text/html;charset=utf-8,a string">my link</a>\n<hr myattr="my-value" />',
    expectedResult: '<exec>alert(1)</exec>\n<a src="data:text/html;charset=utf-8,a string">my link</a>\n<hr myattr="my-value" />',
    description: 'safety off',
    opts: {inline: true, safety: false}
  },
  {
    input: '<exec>alert(1)</exec>\n<a src="data:text/html;charset=utf-8,a string">my link</a>\n<hr myattr="my-value" />',
    expectedResult: 'alert(1)\n<a>my link</a>\n<hr>',
    description: 'invalid safety_opts',
    opts: {inline: true, safety_opts: false}
  },
  {
    input: '<exec>alert(1)</exec>',
    expectedResult: '<exec>alert(1)</exec>',
    description: 'add_tags',
    opts: {inline: true, safety_opts: {add_tags: ['exec']}}
  },
  {
    input: '<a src="data:text/html;charset=utf-8,a string">my link</a>',
    expectedResult: '<a src="data:text/html;charset=utf-8,a string">my link</a>',
    description: 'add_data_uri_tags',
    opts: {inline: true, safety_opts: {add_data_uri_tags: ['a']}}
  },
  {
    input: '<hr myattr="my-value" />',
    expectedResult: '<hr myattr="my-value">',
    description: 'add_attrs',
    opts: {inline: true, safety_opts: {add_attrs: ['myattr']}}
  },
]

describe('mdr_safety', () => {
  testCases.forEach((tc) => {
    it(tc.description, () => {
      const output = mdr(tc.input, tc.opts)
      expect(output).toEqual(tc.expectedResult)
    })
  })
})
