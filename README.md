# mdr

[![npm](https://badgen.net/npm/v/@btnguyen2k/mdr)](https://www.npmjs.com/package/@btnguyen2k/mdr)
[![Actions Status](https://github.com/btnguyen2k/js-mdr/actions/workflows/ci.yaml/badge.svg)](https://github.com/btnguyen2k/js-mdr/actions)
[![codecov](https://codecov.io/gh/btnguyen2k/js-mdr/branch/main/graph/badge.svg)](https://codecov.io/gh/btnguyen2k/js-mdr)

Render Markdown to HTML with rich extensions.

⭐ Based on [markedjs](https://marked.js.org/) with GFM flavor. Enabled extensions:
- marked-base-url
- marked-mangle
- GFM header-id

⭐ Code highlight with [highlight.js](https://highlightjs.org/).

⭐ Support [Katex](https://katex.org/) math formula.

## Installation

**with npm**

```shell
$ npm install -S @btnguyen2k/mdr
```

## Usage

```javascript
import {mdr} from '@btnguyen2k/mdr'

const markdown = '# Hello World!'
const options = {} // optional
console.log(mdr(markdown, options)) // <h1 id="hello-world">Hello World!</h1>
```

## Options

## License

MIT - see [LICENSE.md](LICENSE.md).
