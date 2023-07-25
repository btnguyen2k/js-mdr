import {mdr} from '../src/index.js'

const testCases = [
  {
    input: 'This is the [home page](btnguyen2k/mdr)',
    expectedResult: '<p>This is the <a href="btnguyen2k/mdr">home page</a></p>\n',
    description: 'baseUrl is not set'
  },
  {
    input: 'This is the [home page](/btnguyen2k/mdr)',
    expectedResult: '<p>This is the <a href="/btnguyen2k/mdr">home page</a></p>\n',
    description: 'baseUrl is is empty',
    opts: {baseUrl: ''}
  },
  {
    input: 'This is the [home page](/btnguyen2k/mdr)',
    expectedResult: '<p>This is the <a href="/btnguyen2k/mdr">home page</a></p>\n',
    description: 'baseUrl is not string',
    opts: {baseUrl: true}
  },

  {
    input: 'This is the [home page](btnguyen2k/mdr)',
    expectedResult: '<p>This is the <a href="http://mydomain/btnguyen2k/mdr">home page</a></p>\n',
    description: 'baseUrl{domain bare}',
    opts: {baseUrl: 'http://mydomain'}
  },
  {
    input: 'This is the [home page](./btnguyen2k/mdr)',
    expectedResult: '<p>This is the <a href="http://mydomain/btnguyen2k/mdr">home page</a></p>\n',
    description: 'baseUrl{domain with trailing slash}',
    opts: {baseUrl: 'http://mydomain/'}
  },

  {
    input: 'This is the [home page](./btnguyen2k/mdr)',
    expectedResult: '<p>This is the <a href="http://mydomain/btnguyen2k/mdr">home page</a></p>\n',
    description: 'baseUrl{ends with file}',
    opts: {baseUrl: 'http://mydomain/file'}
  },
  {
    input: 'This is the [home page](btnguyen2k/mdr)',
    expectedResult: '<p>This is the <a href="http://mydomain/folder/btnguyen2k/mdr">home page</a></p>\n',
    description: 'baseUrl{ends with folder}',
    opts: {baseUrl: 'http://mydomain/folder/'}
  },

  {
    input: 'This is the [home page](/btnguyen2k/mdr)',
    expectedResult: '<p>This is the <a href="http://mydomain/btnguyen2k/mdr">home page</a></p>\n',
    description: 'url is from root',
    opts: {baseUrl: 'http://mydomain/a/b/c/'}
  },

  {
    input: 'This is the [home page](../btnguyen2k/mdr)',
    expectedResult: '<p>This is the <a href="http://mydomain/a/btnguyen2k/mdr">home page</a></p>\n',
    description: 'baseUrl{ends with file}, jump up one level',
    opts: {baseUrl: 'http://mydomain/a/b/file'}
  },
  {
    input: 'This is the [home page](../btnguyen2k/mdr)',
    expectedResult: '<p>This is the <a href="http://mydomain/a/b/btnguyen2k/mdr">home page</a></p>\n',
    description: 'baseUrl{ends with folder}, jump up one level',
    opts: {baseUrl: 'http://mydomain/a/b/c/'}
  },

  {
    input: 'This is the [home page](btnguyen2k/mdr)',
    expectedResult: '<p>This is the <a href="a/b/btnguyen2k/mdr">home page</a></p>\n',
    description: 'baseUrl{relative, ends end with file} vs url{relative}',
    opts: {baseUrl: './a/b/file'}
  },
  {
    input: 'This is the [home page](./btnguyen2k/mdr)',
    expectedResult: '<p>This is the <a href="/a/b/c/btnguyen2k/mdr">home page</a></p>\n',
    description: 'baseUrl{from root, ends with folder} vs url{relative}',
    opts: {baseUrl: '/a/b/c/'}
  },
  {
    input: 'This is the [home page](/btnguyen2k/mdr)',
    expectedResult: '<p>This is the <a href="/btnguyen2k/mdr">home page</a></p>\n',
    description: 'baseUrl{relative} vs url{from root}',
    opts: {baseUrl: 'a/b/c'}
  },
  {
    input: 'This is the [home page](/btnguyen2k/mdr)',
    expectedResult: '<p>This is the <a href="/btnguyen2k/mdr">home page</a></p>\n',
    description: 'baseUrl{from root} vs url{from root}',
    opts: {baseUrl: '/a/b/c'}
  },

  {
    input: 'This is the [home page](http://localhost/btnguyen2k/mdr)',
    expectedResult: '<p>This is the <a href="http://localhost/btnguyen2k/mdr">home page</a></p>\n',
    description: 'absolute link should be intact, vs domain',
    opts: {baseUrl: 'http://mysite'}
  },
  // {
  //   input: 'This is the [home page](http://localhost/btnguyen2k/mdr)',
  //   expectedResult: '<p>This is the <a href="http://localhost/btnguyen2k/mdr">home page</a></p>\n',
  //   description: 'absolute link should be intact, vs root',
  //   opts: {baseUrl: '/a/b/c'}
  // },
  // {
  //   input: 'This is the [home page](http://localhost/btnguyen2k/mdr)',
  //   expectedResult: '<p>This is the <a href="http://localhost/btnguyen2k/mdr">home page</a></p>\n',
  //   description: 'absolute link should be intact, vs relative',
  //   opts: {baseUrl: 'a/b/c/'}
  // },
]

describe('mdr_v5_baseurl', () => {
  testCases.forEach((tc) => {
    it(tc.description, () => {
      const opts = tc.opts ? tc.opts : {}
      expect(mdr(tc.input, opts)).toEqual(tc.expectedResult)
    })
  })
})
