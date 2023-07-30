/**
 ext-inline-katex - marked extension to handle inline Katex code (e.g. text enclosed by $).

 Author: Thanh Nguyen <btnguyen2k (at) gmail (dot) com>
 Home  : https://github.com/btnguyen2k/js-mdr

 Usage:
 - MDR enables this extension by default.
 - Remember to import Katex stylesheets to your app (e.g. import 'katex/dist/katex.min.css').
 - Remember to import necessary Katex modules if needed (e.g. import 'katex/contrib/mhchem/mhchem').
 */

import katex from 'katex'

export function extInlineKatex(options) {
  return {
    extensions: [
      inlineKatex(createInlineKatexRenderer(options))
    ]
  }
}

function createInlineKatexRenderer(options) {
  const kopts = {output: 'htmlAndMathml', throwOnError: false, ...options, displayMode: false}
  return (token) => katex.renderToString(token.text, kopts)
}

const inlineStartRule = /(?<=\s|^)\$([^$]+)\$/
const inlineRule = /^\$([^$]+)\$/

function inlineKatex(renderer) {
  return {
    name: 'inlineKatex',
    level: 'inline',
    start(src) {
      const match = src.match(inlineStartRule)
      return match ? match.index : undefined
    },
    tokenizer(src, tokens) {
      const match = src.match(inlineRule)
      if (match) {
        return {
          type: 'inlineKatex',
          raw: match[0],
          text: match[1].trim(),
        }
      }
    },
    renderer
  }
}
