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

This package exports a function `mdr` that can be used to render Markdown to HTML:

```javascript
import {mdr} from '@btnguyen2k/mdr'

const markdown = '# Hello World!'
const options = {} // optional
console.log(mdr(markdown, options)) // <h1 id="hello-world">Hello World!</h1>
```

## Options

Function `mdr` takes an optional 2nd argument, which is an object with the following properties:

| Property                      | Type     | Default                                          | Description                                                                                                                                                                           |
|-------------------------------|----------|--------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| inline                        | boolean  | `false`                                          | If `true`, the output HTML will _not_ be wrapped in `<p>` tag.                                                                                                                        |
| safety                        | boolean  | `true`                                           | If `true`, the output HTML will be sanitized using DOMPurify.                                                                                                                         |
| safety_opts                   | object   | (see bellow)                                     | Options for DOMPurify if `safety=true`.                                                                                                                                               |
| safety_opts.add_tags          | array    | `['iframe']`                                     | Additional tags to allow <sup>[1]</sup>.                                                                                                                                              |
| safety_opts.add_data_uri_tags | array    | `['iframe']`                                     | Additional tags to allow data URI <sup>[1]</sup>.                                                                                                                                     |
| safety_opts.add_attrs         | array    | `['target', 'allow']`                            | Additional attributes to allow <sup>[1][2]</sup>.                                                                                                                                     |
| toc_container                 | array    | undefined                                        | If supplied, the generated table of content will be pushed to this array.                                                                                                             |
| katex                         | boolean  | `true`                                           | If `true`, KaTeX support is enabled.                                                                                                                                                  |
| katex_opts                    | object   | `{output: 'htmlAndMathml', throwOnError: false}` | Options for KaTeX if `katex=true`. See see https://katex.org/docs/options.html                                                                                                        |
| ghgist                        | boolean  | `true`                                           | If `true`, GitHub Gist support is enabled.                                                                                                                                            |
| ghgist_opts                   | object   | `{}`                                             | Options for GitHub Gist if `ghgist=true`. See below for details.                                                                                                                      |
| video                         | boolean  | `true`                                           | If `true`, video embedding is enabled.                                                                                                                                                |
| video_opts                    | object   | `{}`                                             | Options for video embedding if `video=true`. See below for details.                                                                                                                   |
| code_handlers                 | object   | `{}`                                             | Custom code block handlers, in format `{code_id: handler}`. If matched, the code enclosed between ```code_id and ``` will be handled by the specified handler. See below for details. |
| baseUrl (*)                   | string   | undefined                                        | If supplied, `marked-base-url` extension is enabled.                                                                                                                                  |
| headerIds (*)                 | boolean  | `true`                                           | If `true`, headings are generated with id attribute.                                                                                                                                  |
| headerPrefix (*)              | string   | `''`                                             | If present, values of generated id attributes are prefixed by this value (imply `headingIds=true`).                                                                                   |
| mangle (*)                    | boolean  | `true`                                           | If `true`, `marked-mangle` extension is enabled.                                                                                                                                      |
| highlight (*)                 | function | undefined                                        | If supplied, `highlight` function is used to highlight source code.                                                                                                                   |
| langPrefix (*)                | string   | `null`                                           | If present, `langPrefix` is used to prefix language name in generated code block.                                                                                                     |

> - [1] `iframe` is used by GitHub Gist and Youtube video extensions. `allow` attribute is also used to enable Youtube features such as fullscreen, autoplay, picture-in-picture, etc.
> - [2] `target` attribute is useful for extrernal links.
> - (*) Do use these options with `mdr`, do _not_ use marked's extensions (e.g. `marked-highlight`, etc) directly.

### Embedding GitHub Gist

`mdr` supports embedding GitHub Gist in Markdown using the following syntax:

<pre>
```gh-gist gistUrl [options]
```
</pre>

| Parameters/Options       | Description                                                                                                                                                                                 |
|--------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| gistUrl                  | The GitHub Gist to embed, can be in short form (e.g. `btnguyen2k/d7577db0981cb157ae95b67b9f6dd733`) or full URL (e.g. https://gist.github.com/btnguyen2k/d7577db0981cb157ae95b67b9f6dd733). |
| style="custom-css-style" | Custom CSS style to apply to the embedded Gist.                                                                                                                                             |
| class="custom-css-class" | Custom CSS class to apply to the embedded Gist.                                                                                                                                             |

Example:

<pre>
```gh-gist btnguyen2k/d7577db0981cb157ae95b67b9f6dd733 class="gist-embed" style="width: 100%; padding-bottom: 8px;"
```
</pre>

Default values for options `style` and `class` can be specified in `ghgist_opts`:

```javascript
import {mdr} from '@btnguyen2k/mdr'

const input = '```gh-gist btnguyen2k/d7577db0981cb157ae95b67b9f6dd733\n```'
const output = mdr(input, {
  ghgist_opts: {
    style: 'width: 100%; padding-bottom: 8px;',
    class: 'gist-embed'
  }
})
```

### Embedding video

`mdr` supports embedding video in Markdown using the following syntax:

<pre>
```video videoUrl [options]
```
</pre>

| Parameters/Options       | Description                                      |
|--------------------------|--------------------------------------------------|
| videoUrl                 | The video embed.                                 |
| style="custom-css-style" | Custom CSS style to apply to the embedded video. |
| class="custom-css-class" | Custom CSS class to apply to the embedded video. |

Example:

<pre>
```video my-video.mp4 class="video-embed" style="width: 100%; padding-bottom: 8px;"
```
</pre>

Default values for options `style` and `class` can be specified in `video_opts`:

```javascript
import {mdr} from '@btnguyen2k/mdr'

const input = '```video my-video.mp4\n```'
const output = mdr(input, {
  video_opts: {
    style: 'width: 100%; padding-bottom: 8px;',
    class: 'gist-embed'
  }
})
```

### Extending MDR

Application developers can extend `mdr` by adding custom code block handlers. For example, the following code adds a custom code block handler to support [Bootstrap Alerts](https://getbootstrap.com/docs/5.0/components/alerts/:

```javascript
const opts = {
  code_handlers: {
    'bs-alert': (code, infoString) => {
      const alertStyle = infoString ? infoString.slice('bs-alert'.length).trim() : 'primary'
      return `<div class="alert alert-${alertStyle}" role="alert">${code}</div>`
    }
  }
}

const input = '```bs-alert info\nA simple primary alert—check it out!\n```'
const output = mdr(input, opts) // '<div class="alert alert-info" role="alert">A simple primary alert—check it out!</div>'
```

## License

MIT - see [LICENSE.md](LICENSE.md).
