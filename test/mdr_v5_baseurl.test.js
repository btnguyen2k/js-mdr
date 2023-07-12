import * as assert from 'assert'
import { mdr } from '../src/index.js'

const testCases = [
    {
        input: 'This is the [home page](btnguyen2k/mdr)',
        expectedResult: '<p>This is the <a href="btnguyen2k/mdr">home page</a></p>\n',
        description: 'relative link since baseUrl is not set'
    },
    {
        input: 'This is the [home page](/btnguyen2k/mdr)',
        expectedResult: '<p>This is the <a href="/btnguyen2k/mdr">home page</a></p>\n',
        description: 'relative link since baseUrl is empty',
        opts: { baseUrl: '' }
    },
    {
        input: 'This is the [home page](/btnguyen2k/mdr)',
        expectedResult: '<p>This is the <a href="/btnguyen2k/mdr">home page</a></p>\n',
        description: 'relative link since baseUrl is not string',
        opts: { baseUrl: true }
    },

    {
        input: 'This is the [home page](btnguyen2k/mdr)',
        expectedResult: '<p>This is the <a href="http://mydomain/btnguyen2k/mdr">home page</a></p>\n',
        description: 'baseUrl{domain bare}',
        opts: { baseUrl: 'http://mydomain' }
    },
    {
        input: 'This is the [home page](./btnguyen2k/mdr)',
        expectedResult: '<p>This is the <a href="http://mydomain/btnguyen2k/mdr">home page</a></p>\n',
        description: 'baseUrl{domain with trailing slash}',
        opts: { baseUrl: 'http://mydomain/' }
    },

    {
        input: 'This is the [home page](./btnguyen2k/mdr)',
        expectedResult: '<p>This is the <a href="http://mydomain/folder/btnguyen2k/mdr">home page</a></p>\n',
        description: 'baseUrl{domain with base folder}',
        opts: { baseUrl: 'http://mydomain/folder' }
    },
    {
        input: 'This is the [home page](btnguyen2k/mdr)',
        expectedResult: '<p>This is the <a href="http://mydomain/folder/btnguyen2k/mdr">home page</a></p>\n',
        description: 'baseUrl{domain with folder and trailing slash}',
        opts: { baseUrl: 'http://mydomain/folder/' }
    },

    {
        input: 'This is the [home page](/btnguyen2k/mdr)',
        expectedResult: '<p>This is the <a href="http://mydomain/btnguyen2k/mdr">home page</a></p>\n',
        description: 'url is from root',
        opts: { baseUrl: 'http://mydomain/a/b/c/' }
    },
    {
        input: 'This is the [home page](../btnguyen2k/mdr)',
        expectedResult: '<p>This is the <a href="http://mydomain/a/b/btnguyen2k/mdr">home page</a></p>\n',
        description: 'jump up one level',
        opts: { baseUrl: 'http://mydomain/a/b/c/' }
    },

    {
        input: 'This is the [home page](btnguyen2k/mdr)',
        expectedResult: '<p>This is the <a href="a/b/c/btnguyen2k/mdr">home page</a></p>\n',
        description: 'baseUrl{relative} vs url{relative}',
        opts: { baseUrl: './a/b/c' }
    },
    {
        input: 'This is the [home page](./btnguyen2k/mdr)',
        expectedResult: '<p>This is the <a href="/a/b/c/btnguyen2k/mdr">home page</a></p>\n',
        description: 'baseUrl{from root} vs url{relative}',
        opts: { baseUrl: '/a/b/c' }
    },
    {
        input: 'This is the [home page](/btnguyen2k/mdr)',
        expectedResult: '<p>This is the <a href="/btnguyen2k/mdr">home page</a></p>\n',
        description: 'baseUrl{relative} vs url{from root}',
        opts: { baseUrl: 'a/b/c' }
    },
    {
        input: 'This is the [home page](/btnguyen2k/mdr)',
        expectedResult: '<p>This is the <a href="/btnguyen2k/mdr">home page</a></p>\n',
        description: 'baseUrl{from root} vs url{from root}',
        opts: { baseUrl: '/a/b/c' }
    },

    {
        input: 'This is the [home page](http://localhost/btnguyen2k/mdr)',
        expectedResult: '<p>This is the <a href="http://localhost/btnguyen2k/mdr">home page</a></p>\n',
        description: 'absolute link should be intact',
        opts: { baseUrl: 'http://mysite' }
    },
    {
        input: 'This is the [home page](http://localhost/btnguyen2k/mdr)',
        expectedResult: '<p>This is the <a href="http://localhost/btnguyen2k/mdr">home page</a></p>\n',
        description: 'absolute link should be intact',
        opts: { baseUrl: '/a/b/c' }
    },
    {
        input: 'This is the [home page](http://localhost/btnguyen2k/mdr)',
        expectedResult: '<p>This is the <a href="http://localhost/btnguyen2k/mdr">home page</a></p>\n',
        description: 'absolute link should be intact',
        opts: { baseUrl: 'a/b/c/' }
    },
  ];

describe('mdr_v5_baseurl', () => {
    testCases.forEach((tc) => {
        it(tc.description, () => {
            const opts = tc['opts'] ? tc['opts'] : {}
            assert.equal(mdr(tc.input, opts), tc.expectedResult)
        })
    })
})
