import {mdr} from '../src/index.js'

const testCases = [
  {
    input: '```gh-gist\n```',
    expectedResult: '<div><iframe src="data:text/html;charset=utf-8,<head><base target=\'_blank\' /></head><body><script src=\'https://gist.github.com/.js\'></script></body>"></iframe></div>',
    description: 'empty GitHub Gist',
  },
  {
    input: '```gh-gist\n```',
    expectedResult: '<pre><code class="hljs language-gh-gist">\n</code></pre>',
    description: 'GitHub Gist is disabled',
    opts: {
      ghgist: false,
    }
  },
  {
    input: '```gh-gist btnguyen2k/d7577db0981cb157ae95b67b9f6dd733\n```',
    expectedResult: '<div><iframe src="data:text/html;charset=utf-8,<head><base target=\'_blank\' /></head><body><script src=\'https://gist.github.com/btnguyen2k/d7577db0981cb157ae95b67b9f6dd733.js\'></script></body>"></iframe></div>',
    description: 'GitHub Gist in short form',
  },
  {
    input: '```gh-gist gist=https://gist.github.com/btnguyen2k/d7577db0981cb157ae95b67b9f6dd733\n```',
    expectedResult: '<div><iframe src="data:text/html;charset=utf-8,<head><base target=\'_blank\' /></head><body><script src=\'https://gist.github.com/btnguyen2k/d7577db0981cb157ae95b67b9f6dd733.js\'></script></body>"></iframe></div>',
    description: 'GitHub Gist in full form',
  },
  {
    input: '```gh-gist btnguyen2k/d7577db0981cb157ae95b67b9f6dd733 class="my-css-class"\n```',
    expectedResult: '<div class="my-css-class"><iframe src="data:text/html;charset=utf-8,<head><base target=\'_blank\' /></head><body><script src=\'https://gist.github.com/btnguyen2k/d7577db0981cb157ae95b67b9f6dd733.js\'></script></body>"></iframe></div>',
    description: 'GitHub Gist with CSS class',
  },
  {
    input: '```gh-gist btnguyen2k/d7577db0981cb157ae95b67b9f6dd733 style="my-css-style"\n```',
    expectedResult: '<div style="my-css-style"><iframe src="data:text/html;charset=utf-8,<head><base target=\'_blank\' /></head><body><script src=\'https://gist.github.com/btnguyen2k/d7577db0981cb157ae95b67b9f6dd733.js\'></script></body>"></iframe></div>',
    description: 'GitHub Gist with CSS style',
  },
  {
    input: '```gh-gist btnguyen2k/d7577db0981cb157ae95b67b9f6dd733\n```',
    expectedResult: '<div class="my-css-class"><iframe src="data:text/html;charset=utf-8,<head><base target=\'_blank\' /></head><body><script src=\'https://gist.github.com/btnguyen2k/d7577db0981cb157ae95b67b9f6dd733.js\'></script></body>"></iframe></div>',
    description: 'default CSS class',
    opts: {
      ghgist_opts: {
        class: 'my-css-class',
      }
    }
  },
  {
    input: '```gh-gist btnguyen2k/d7577db0981cb157ae95b67b9f6dd733\n```',
    expectedResult: '<div style="my-css-style"><iframe src="data:text/html;charset=utf-8,<head><base target=\'_blank\' /></head><body><script src=\'https://gist.github.com/btnguyen2k/d7577db0981cb157ae95b67b9f6dd733.js\'></script></body>"></iframe></div>',
    description: 'default CSS style',
    opts: {
      ghgist_opts: {
        style: 'my-css-style',
      }
    }
  },
  {
    input: '```gh-gist btnguyen2k/d7577db0981cb157ae95b67b9f6dd733 ratio="16x9"\n```',
    expectedResult: '<div class="mb-4 ratio ratio-16x9"><iframe src="data:text/html;charset=utf-8,<head><base target=\'_blank\' /></head><body><script src=\'https://gist.github.com/btnguyen2k/d7577db0981cb157ae95b67b9f6dd733.js\'></script></body>"></iframe></div>',
    description: 'with params_converter',
    opts: {
      ghgist_opts: {
        params_converter: (params) => {
          if (params.ratio) {
            params.class = `mb-4 ratio ratio-${params.ratio}`
          }
          return params
        }
      }
    }
  },
]

describe('mdr_gh-gist', () => {
  testCases.forEach((tc) => {
    it(tc.description, () => {
      const output = mdr(tc.input, tc.opts)
      expect(output).toEqual(tc.expectedResult)
    })
  })
})
