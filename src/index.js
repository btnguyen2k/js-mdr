/**
 mdr - parse and render Markdown with rich extensions.

 Author: Thanh Nguyen <btnguyen2k (at) gmail (dot) com>
 Home  : https://github.com/btnguyen2k/mdr
 */

// import 'highlight.js/styles/default.css'
import hljs from 'highlight.js' // all languages

// import katex from 'katex'
// import 'katex/contrib/mhchem/mhchem.js'
// import 'katex/dist/katex.min.css'
import {marked, Marked} from 'marked'
import {mangle} from 'marked-mangle'

import DOMPurify from 'dompurify'

import mermaid from 'mermaid'

import {extBaseUrl} from './ext-base-url.js'
import {extCode} from './ext-code.js'
import {MdrRenderer} from './renderer.js'

mermaid.initialize({startOnLoad: false})

const defaultMarkedOpts = {
  gfm: true,
  headerIds: true,
  headerPrefix: '',
  mangle: true,
  langPrefix: null, // to disable marked-v5.0.0 warning
  sanitize: false, // sanitize option is deprecated
  safety: true,
  safety_opts: {
    add_tags: ['iframe'],
    add_data_uri_tags: ['iframe'],
    add_attr: ['target', 'allow'],
  },
}

// default: use highlight.js to highlight source code
const defaultMarkedHighlightOpts = {
  langPrefix: 'hljs language-', // highlight.js css expects a top-level 'hljs' class
  highlight(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext'
    const result = hljs.highlight(code, {language})
    return result.value
  }
}

/**
 * Parse and render Markdown text.
 * @param {string} mdtext the input Markdown text to parse
 * @param {object} opts (optional) provide additional options, or override defaults one.
 *   See available options at https://marked.js.org/using_advanced#options. Other options:
 *   - inline (boolean): if true, the output HTML will not be wrapped in <p> tag
 *   - safety (boolean): if true, the output HTML will be sanitized using DOMPurify, then safety_opts will be used
 *   - safety_opts (object): sub-options:
 *     - add_tags (array): additional tags to allow, default is ['iframe']
 *     - add_data_uri_tags (array): additional tags to allow data URI, default is ['iframe']
 *     - add_attr (array): additional attributes to allow, default is ['target', 'allow']
 * @param {object} tocContainer (optional) container to store the generated table of content
 * @returns {string} the rendered HTML
 */
function mdr(mdtext, opts, tocContainer) {
  // create new instance so that we can use different options
  const markedInstance = new Marked()

  opts = typeof opts === 'object' && opts != null ? opts : {}
  const markedOpts = {...defaultMarkedOpts, ...opts} // merge options
  for (const key in markedOpts) {
    if (markedOpts[key] == null) {
      delete markedOpts[key]
    }
  }

  const mdrRenderer = markedOpts.renderer ? markedOpts.renderer : new MdrRenderer(markedOpts)
  markedOpts.renderer = mdrRenderer

  // // process all instances of [[do-tag...]] first
  // const tags = typeof opts['tags'] == 'object' ? opts['tags'] : {}
  // mdtext = mdrRenderer._renderInlineDoTags(mdtext, tags)

  /* marked v5.x */
  // baseUrl
  if (markedOpts.baseUrl) {
    if (typeof markedOpts.baseUrl === 'string' && markedOpts.baseUrl.trim() !== '') {
      markedInstance.use(extBaseUrl(markedOpts.baseUrl))
    }
    delete markedOpts.baseUrl
  }
  // source code syntax highlight
  // const markedHighlightOpts = typeof markedOpts.highlight === 'object' && markedOpts.highlight != null
  //   ? {...markedOpts.highlight}
  //   : {...defaultMarkedHighlightOpts}
  // markedInstance.use(extCode({...markedOpts, ...markedHighlightOpts}))
  // header ids
  markedOpts.headerIds = false
  delete markedOpts.headerPrefix
  // mangle
  if (markedOpts.mangle) {
    delete markedOpts.mangle
    markedInstance.use(mangle())
  }

  const html = opts.inline ? markedInstance.parseInline(mdtext, markedOpts) : markedInstance.parse(mdtext, markedOpts)

  // //render: katex
  // const latexHtml = html.replace(reKatexId, (_match, capture) => {
  //     const token = mathExpMap[capture]
  //     const renderedKatex = katex.renderToString(token.expression, {
  //         displayMode: token.type == 'block',
  //         output: 'html',
  //         throwOnError: false
  //     })
  //     return token.type == 'block' ? ('<div data-aos="fade-up">' + renderedKatex + '</div>') : renderedKatex
  // })

  const latexHtml = html

  if (typeof tocContainer === 'object') {
    tocContainer.value = mdrRenderer.toc
  }

  let ADD_TAGS = ['iframe']
  let ADD_DATA_URI_TAGS = ['iframe']
  let ADD_ATTR = ['target', 'allow']
  if (opts.safety_opts) {
    ADD_TAGS = opts.safety_opts.add_tags ? opts.safety_opts.add_tags : ADD_TAGS
    ADD_DATA_URI_TAGS = opts.safety_opts.add_data_uri_tags ? opts.safety_opts.add_data_uri_tags : ADD_DATA_URI_TAGS
    ADD_ATTR = opts.safety_opts.add_attr ? opts.safety_opts.add_attr : ADD_ATTR
  }

  return opts.safety
    ? DOMPurify.sanitize(latexHtml, {
      ADD_TAGS,
      ADD_DATA_URI_TAGS, // allow iframe tag for GitHub Gist and Youtube videos
      ADD_ATTR, // allow target and allow attributes for a and iframe tags
    })
    : latexHtml
}

export {
  mdr,
  MdrRenderer
}
