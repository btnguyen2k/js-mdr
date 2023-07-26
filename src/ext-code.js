/**
 base-url - marked extension to handle ``` block.

 Author: Thanh Nguyen <btnguyen2k (at) gmail (dot) com>
 Home  : https://github.com/btnguyen2k/js-mdr
 */

// import 'highlight.js/styles/default.css'
import hljs from 'highlight.js' // all languages

// default: use highlight.js to highlight source code
const defaultMarkedHighlightOpts = {
  langPrefix: 'hljs language-', // highlight.js css expects a top-level 'hljs' class
  highlight(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext'
    const result = hljs.highlight(code, {language})
    return result.value
  }
}

function escapeHtml(html) {
  return html.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function extCode(options) {
  const langPrefix = options && typeof options.langPrefix === 'string'
    ? options.langPrefix.trim()
    : defaultMarkedHighlightOpts.langPrefix
  const highlight = options && typeof options.highlight === 'function'
    ? options.highlight
    : defaultMarkedHighlightOpts.highlight

  return {
    walkTokens(token) {
      if (token.type !== 'code') {
        return
      }
      const lang = token.lang || 'plaintext'
      const code = highlight(token.text, lang)
      if (typeof code === 'string' && code !== token.text) {
        token.escaped = true
        token.text = code
      }
    },
    renderer: {
      code(code, infoString, escaped) {
        const lang = (infoString || 'plaintext').toLowerCase()
        const classAttr = `class="${langPrefix}${escapeHtml(lang)}"`
        code = code.replaceAll(/\s*$/g, '')
        return `<pre><code ${classAttr}>${escaped ? code : escapeHtml(code)}\n</code></pre>`
      }
    }
  }
}
