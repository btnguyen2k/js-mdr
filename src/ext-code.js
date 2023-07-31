/**
 ext-code - marked extension to handle code block (e.g. text blocks enclosed by triple back-sticks ```).

 Author: Thanh Nguyen <btnguyen2k (at) gmail (dot) com>
 Home  : https://github.com/btnguyen2k/js-mdr

 Usage:
 - MDR enables this extension by default.
 */

import {extCodeHighlight} from './ext-code-highlight.js'
import {escapeHtml} from './utils.js'

export function extCode(options) {
  const codeHandlers = {
    '*': extCodeHighlight(options)
  }

  const defaultCodeHandler = extCodeHighlight(options)
  const catchInvalidCodeHandler = {
    code(code, infoString, escaped) {
      return `<pre><code>${escapeHtml(code)}\n</code></pre>`
    }
  }

  if (typeof options.code_handlers === 'object') {
    for (const codeId of Object.getOwnPropertyNames(options.code_handlers)) {
      const handler = options.code_handlers[codeId]
      codeHandlers[codeId.toLowerCase()] = handler
    }
  }

  return {
    renderer: {
      code(code, infoString, escaped) {
        const lang = (infoString || '*').toLowerCase()
        const handler = codeHandlers[lang] || defaultCodeHandler
        return handler.code ? handler.code(code, infoString, escaped) : catchInvalidCodeHandler.code(code, infoString, escaped)
      }
    }
  }
}
