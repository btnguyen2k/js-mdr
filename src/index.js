/*
mdr - parse and render Markdown with rich extensions.

Author: Thanh Nguyen <btnguyen2k (at) gmail (dot) com>
Home  : https://github.com/btnguyen2k/mdr
*/

//import 'highlight.js/styles/default.css'
import hljs from 'highlight.js' // all languages

import katex from 'katex'
// import 'katex/contrib/mhchem/mhchem.js'
// import 'katex/dist/katex.min.css'
import {marked} from 'marked'
import {markedHighlight} from 'marked-highlight'
import {mangle} from 'marked-mangle'
import {gfmHeadingId} from 'marked-gfm-heading-id'
import DOMPurify from 'dompurify'

import mermaid from 'mermaid'

mermaid.initialize({startOnLoad: false})

class MdrRenderer extends marked.Renderer {
    constructor(options) {
        super(options)
    }
}

const defaultMarkedOpts = {
    gfm: true,
    headerIds: true,
    mangle: true,
}

// default: use highlight.js to highlight source code
const defaultMarkedHighlightOpts = {
    langPrefix: 'hljs language-', // highlight.js css expects a top-level 'hljs' class
    highlight(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext'
        return hljs.highlight(code, {language}).value;
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
    let markedOpts = {...defaultMarkedOpts}
    opts = typeof opts == 'object' ? opts : {}
    markedOpts = {...markedOpts, ...opts} // merge options
    delete markedOpts['sanitize'] // sanitize option is deprecated, use DOMPurify instead
    let mdrRenderer = markedOpts.renderer ? markedOpts.renderer : new MdrRenderer(markedOpts)
    markedOpts.renderer = mdrRenderer

    // // process all instances of [[do-tag...]] first
    // const tags = typeof opts['tags'] == 'object' ? opts['tags'] : {}
    // mdtext = mdrRenderer._renderInlineDoTags(mdtext, tags)

    /* marked v5.x */
    // mangle
    if (markedOpts['mangle']) {
        markedOpts['mangle']= false
        marked.use(mangle())
    }
    // headerIds
    if (markedOpts['headerIds']) {
        markedOpts['headerIds']= false
        marked.use(gfmHeadingId({}))
    }
    // source code syntax highlight
    const markedHighlightOpts = typeof markedOpts['highlight'] == 'object' ? {...markedOpts['highlight']} : {...defaultMarkedHighlightOpts}
    marked.use(markedHighlight(markedHighlightOpts))

    let html = marked.parse(mdtext, markedOpts)
    if (opts['inline']) {
        html = html.replaceAll(/^<\s*p\s*>/gi, '').replaceAll(/<\s*\/\s*p\s*>$/gi, '')
    }

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

    if (typeof tocContainer == 'object') {
        tocContainer.value = mdrRenderer.toc
    }

    const safety = opts['safety'] ? true : false
    let ADD_TAGS = opts['add_tags'] ? opts['add_tags'] : ['iframe']
    let ADD_DATA_URI_TAGS = opts['add_data_uri_tags'] ? opts['add_data_uri_tags'] : ['iframe']
    let ADD_ATTR = opts['add_attr'] ? opts['add_attr'] : ['target', 'allow']
    return safety ? DOMPurify.sanitize(latexHtml, {
        ADD_TAGS: ADD_TAGS, ADD_DATA_URI_TAGS: ADD_DATA_URI_TAGS, // allow iframe tag for GitHub Gist and Youtube videos
        ADD_ATTR: ADD_ATTR, // allow target and allow attributes for a and iframe tags
    }) : latexHtml
}

export {
    mdr,
    MdrRenderer
}
