/**
 mdr - parse and render Markdown with rich extensions.

 Author: Thanh Nguyen <btnguyen2k (at) gmail (dot) com>
 Home  : https://github.com/btnguyen2k/js-mdr
 */

import {Marked} from 'marked'
import {baseUrl as markedBaseUrl} from 'marked-base-url'
import {mangle as markedMangle} from 'marked-mangle'
import {extCode} from './ext-code.js'
import {extInlineKatex} from './ext-inline-katex.js'
import {extCodeKatex} from './ext-code-katex.js'
import {extCodeGHGist} from './ext-code-ghgist.js'
import {extCodeVideo} from './ext-code-video.js'
import {MdrRenderer} from './renderer.js'
import {checksum} from '@btnguyen2k/checksum'

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
  katex: true,
  katex_opts: {
    output: 'htmlAndMathml',
    throwOnError: false,
  },
  ghgist: true,
  ghgist_opts: {},
  video: true,
  video_opts: {},
}

function addCodeHandler(opts, codeId, handler) {
  if (typeof opts.code_handlers !== 'object') {
    opts.code_handlers = {}
  }
  opts.code_handlers[codeId] = handler
  return opts
}

const cachedInstances = {}
function getCachedInstance(opts) {
  const markedOpts = {...opts}
  const hash = checksum(markedOpts, {disable_warning_cyclic: true})
  const markedInstance = cachedInstances[hash] ? cachedInstances[hash] : new Marked()
  if (cachedInstances[hash]) {
    return markedInstance
  }
  const renderer = markedOpts.renderer ? markedOpts.renderer : new MdrRenderer(markedOpts)
  markedInstance.defaults.renderer = renderer

  // Katex support
  if (markedOpts.katex) {
    markedInstance.use(extInlineKatex(markedOpts.katex_opts))
    addCodeHandler(markedOpts, 'katex', extCodeKatex(markedOpts.katex_opts))
  }

  // GitHub Gist support
  if (markedOpts.ghgist) {
    addCodeHandler(markedOpts, 'gh-gist', extCodeGHGist(markedOpts.ghgist_opts))
  }

  // Video embedding support
  if (markedOpts.video) {
    addCodeHandler(markedOpts, 'video', extCodeVideo(markedOpts.video_opts))
  }

  /* marked v5.x */
  // baseUrl
  if (markedOpts.baseUrl) {
    if (typeof markedOpts.baseUrl === 'string' && markedOpts.baseUrl.trim() !== '') {
      markedInstance.use(markedBaseUrl(markedOpts.baseUrl))
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
    markedInstance.use(markedMangle())
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
 *   - {boolean} inline: if true, the output HTML will not be wrapped in <p> tag
 *   - {boolean} safety: if true, the output HTML will be sanitized using DOMPurify, then safety_opts will be used
 *   - {object} safety_opts: sub-options:
 *     - {array} add_tags: additional tags to allow, default is ['iframe']
 *     - {array} add_data_uri_tags: additional tags to allow data URI, default is ['iframe']
 *     - {array} add_attrs: additional attributes to allow, default is ['target', 'allow']
 *   - {array} toc_container: if supplied, the generated table of content will be pushed to this array
 *   - {boolean} katex: if true, KaTeX support is enabled
 *   - {object} katex_opts: options for KaTeX, see https://katex.org/docs/options.html
 *   - {boolean} ghgist: if true, GitHub Gist support is enabled
 *   - {object} ghgist_opts: options for GitHub Gist
 *   - {boolean} video: if true, video embedding is enabled
 *   - {object} video_opts: options for video embedding
 *   - {object} code_handlers: custom code block handlers. If matched, the code enclosed between ```code_id and ``` will be
 *   handled by the specified handler. The code_handlers object must be a map of {code_id: handler}. The handler must be an
 *   object which has a function with signature code(codeText, infoString, escaped) that returns the HTML output.
 *
 *   Marked options that should be used instead of extensions:
 *   - {string} baseUrl: if baseUrl option is present, marked-base-url extension is enabled. Do not use marked-base-url directly.
 *   - {boolean} headerIds / {string} headerPrefix: if headerIds/headerPrefix option is present, headings are generated with id attribute. Do not use marked-gfm-heading-id directly.
 *   - {boolean} mangle: if mangle option is present, marked-mangle extension is enabled. Do not use marked-mangle directly.
 *   - {function} highlight / {string} langPrefix: source code syntax highlight is enabled by default with highlight.js. Supply custom highlight
 *     function and/or langPrefix via these options. Do not use marked-highlight directly.
 * @returns {string} the rendered HTML
 */
function mdr(mdtext, opts = {}) {
  opts = typeof opts === 'object' && opts != null ? opts : {}
  let markedOpts = {...defaultMarkedOpts, ...opts} // merge options
  for (const key in markedOpts) {
    if (markedOpts[key] == null) {
      delete markedOpts[key]
    }
  }

  const markedInstance = getCachedInstance(markedOpts)
  markedOpts = markedInstance.sanitizedOpts

  const renderer = markedInstance.defaults.renderer
  renderer.tocContainer = opts.toc_container

  const html = opts.inline
    ? markedInstance.parseInline(mdtext, markedOpts)
    : markedInstance.parse(mdtext, markedOpts)

  let ADD_TAGS = ['iframe']
  let ADD_DATA_URI_TAGS = ['iframe'] // allow iframe tag for GitHub Gist and Youtube videos
  let ADD_ATTRS = ['target', 'allow'] // allow target and allow attributes for a and iframe tags
  if (markedOpts.safety_opts) {
    ADD_TAGS = markedOpts.safety_opts.add_tags ? markedOpts.safety_opts.add_tags : ADD_TAGS
    ADD_DATA_URI_TAGS = markedOpts.safety_opts.add_data_uri_tags ? markedOpts.safety_opts.add_data_uri_tags : ADD_DATA_URI_TAGS
    ADD_ATTRS = markedOpts.safety_opts.add_attrs ? markedOpts.safety_opts.add_attrs : ADD_ATTRS
  }

  return markedOpts.safety
    ? purify.sanitize(html, {
      ADD_TAGS: ADD_TAGS,
      ADD_DATA_URI_TAGS: ADD_DATA_URI_TAGS,
      ADD_ATTR: ADD_ATTRS,
    })
    : html
}

export {
  mdr,
  MdrRenderer
}
