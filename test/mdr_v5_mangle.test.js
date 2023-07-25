import {mdr} from '../src/index.js'

describe('mdr_v5_mangle', () => {
  beforeEach(() => {
    // Reset options before each test.
  })

  afterEach(() => {
    // Reset options after each test.
  })

  test('mangle: false', () => {
    const input = 'my email: email@example.com'
    const expectedResult = '<p>my email: <a href="mailto:email@example.com">email@example.com</a></p>\n'
    const opts = {mangle: false}
    expect(mdr(input, opts)).toEqual(expectedResult)
  })

  test('mangle: true', () => {
    const input = 'my email: email@example.com'
    const expectedResult = /^<p>my email: <a href="mailto:(&#x?[\da-f]+;)*">(&#x?[\da-f]+;)*<\/a><\/p>\n$/
    const opts = {mangle: true}
    expect(expectedResult.test(mdr(input, opts)))
  })
})
