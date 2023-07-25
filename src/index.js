/**
 mdr - parse and render Markdown with rich extensions.

 Author: Thanh Nguyen <btnguyen2k (at) gmail (dot) com>
 Home  : https://github.com/btnguyen2k/js-mdr
 */

// import katex from 'katex'
// import 'katex/contrib/mhchem/mhchem.js'
// import 'katex/dist/katex.min.css'
import {Marked} from 'marked'
import {baseUrl} from 'marked-base-url'
import {mangle} from 'marked-mangle'
import {extCode} from './ext-code.js'
import {MdrRenderer} from './renderer.js'

import {checksum} from '@btnguyen2k/checksum'

// import mermaid from 'mermaid'
// mermaid.initialize({startOnLoad: false})

import {JSDOM} from 'jsdom'
import DOMPurify from 'dompurify'
const window = new JSDOM('').window
const purify = DOMPurify(window)

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

const cachedInstances = {}
function getCachedInstance(markedOpts) {
  const hash = checksum(markedOpts, {disable_warning_cyclic: true})
  if (cachedInstances[hash]) {
    return cachedInstances[hash]
  }
  const markedInstance = new Marked()

  const mdrRenderer = markedOpts.renderer ? markedOpts.renderer : new MdrRenderer(markedOpts)
  markedInstance.defaults.renderer = mdrRenderer

  /* marked v5.x */
  // baseUrl
  if (markedOpts.baseUrl) {
    if (typeof markedOpts.baseUrl === 'string' && markedOpts.baseUrl.trim() !== '') {
      markedInstance.use(baseUrl(markedOpts.baseUrl))
    }
    delete markedOpts.baseUrl
  }

  // source code syntax highlight
  markedInstance.use(extCode(markedOpts))
  delete markedOpts.langPrefix
  delete markedOpts.highlight

  // header ids
  markedOpts.headerIds = false
  delete markedOpts.headerPrefix

  // mangle
  if (markedOpts.mangle) {
    delete markedOpts.mangle
    markedInstance.use(mangle())
  }

  markedInstance.sanitizedOpts = markedOpts

  cachedInstances[hash] = markedInstance
  return markedInstance
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
 *   Marked options that should be used instead of extensions:
 *   - baseUrl: if baseUrl option is present, marked-base-url extension is enabled. Do not use marked-base-url directly.
 *   - headerIds/headerPrefix: if headerIds/header option is present, headings are generated with id attribute. Do not use marked-gfm-heading-id directly.
 *   - mangle: if mangle option is present, marked-mangle extension is enabled. Do not use marked-mangle directly.
 *   - highlight/langPrefix: source code syntax highlight is enabled by default with highlight.js. Supply custom highlight
 *     function and/or langPrefix via these options. Do not use marked-highlight directly.
 * @param {object} tocContainer (optional) container to store the generated table of content
 * @returns {string} the rendered HTML
 */
function mdr(mdtext, opts = {}, tocContainer = null) {
  opts = typeof opts === 'object' && opts != null ? opts : {}
  let markedOpts = {...defaultMarkedOpts, ...opts} // merge options
  for (const key in markedOpts) {
    if (markedOpts[key] == null) {
      delete markedOpts[key]
    }
  }

  const markedInstance = getCachedInstance(markedOpts)
  markedOpts = markedInstance.sanitizedOpts

  const html = opts.inline
    ? markedInstance.parseInline(mdtext, markedOpts)
    : markedInstance.parse(mdtext, markedOpts)

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

  // if (typeof tocContainer === 'object' && tocContainer !== null) {
  //   tocContainer.value = mdrRenderer.toc
  // }

  let ADD_TAGS = ['iframe']
  let ADD_DATA_URI_TAGS = ['iframe']
  let ADD_ATTR = ['target', 'allow']
  if (markedOpts.safety_opts) {
    ADD_TAGS = markedOpts.safety_opts.add_tags ? markedOpts.safety_opts.add_tags : ADD_TAGS
    ADD_DATA_URI_TAGS = markedOpts.safety_opts.add_data_uri_tags ? markedOpts.safety_opts.add_data_uri_tags : ADD_DATA_URI_TAGS
    ADD_ATTR = markedOpts.safety_opts.add_attr ? markedOpts.safety_opts.add_attr : ADD_ATTR
  }

  return markedOpts.safety
    ? purify.sanitize(latexHtml, {
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
