/**
 ext-code-highlight - extension to highlight code block (source code is enclosed by ```language and ```)s.

 Author: Thanh Nguyen <btnguyen2k (at) gmail (dot) com>
 Home  : https://github.com/btnguyen2k/js-mdr

 Usage:
 - MDR enables this extension by default.
 - Remember to import highlight.js stylesheets to your app (e.g. import 'highlight.js/styles/default.css').
 */

import hljs from 'highlight.js'
import {escapeHtml} from './utils.js'

// default: use highlight.js to highlight source code
const defaultMarkedHighlightOpts = {
  langPrefix: 'hljs language-', // highlight.js css expects a top-level 'hljs' class
  highlight(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext'
    const result = hljs.highlight(code, {language})
    return result.value
  }
}

export function extCodeHighlight(options) {
  const langPrefix = options && typeof options.langPrefix === 'string'
    ? options.langPrefix.trim()
    : defaultMarkedHighlightOpts.langPrefix
  const highlight = options && typeof options.highlight === 'function'
    ? options.highlight
    : defaultMarkedHighlightOpts.highlight

  return {
    code(code, infoString, escaped) {
      const lang = (infoString || 'plaintext').toLowerCase()
      const highlightedCode = highlight(code, lang).replaceAll(/\s*$/g, '')
      const classAttr = `class="${langPrefix}${escapeHtml(lang)}"`
      return `<pre><code ${classAttr}>${highlightedCode}\n</code></pre>`
    }
  }
}
