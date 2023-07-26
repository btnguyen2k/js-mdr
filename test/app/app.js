import {mdr} from '../../src/index.js'

const testCases = [
  {
    input: '<a src="data:text/html;charset=utf-8,a string">my link</a>',
    expectedResult: '<a src="data:text/html;charset=utf-8,a string">my link</a>',
    description: 'add_data_uri_tags',
    opts: {inline: false, safety_opts: {add_data_uri_tags: ['a']}}
  },
  {
    input: '<exec>alert(1)</exec>',
    expectedResult: '<exec>alert(1)</exec>',
    description: 'add_tags',
    opts: {inline: false, safety_opts: {add_tags: ['exec']}}
  },
  {
    input: '<hr myattr="my-value" />',
    expectedResult: '<hr myattr="my-value">',
    description: 'add_attrs',
    opts: {inline: false, safety_opts: {add_attrs: ['myattr']}}
  },
]

testCases.forEach((tc) => {
  const output = mdr(tc.input, tc.opts)
  console.log('[DEBUG]', tc.description, output)
})
