/**
 ext-code-katex - extension to handle ```katex.

 Author: Thanh Nguyen <btnguyen2k (at) gmail (dot) com>
 Home  : https://github.com/btnguyen2k/js-mdr

 Usage:
 - MDR enables this extension by default.
 - Remember to import Katex stylesheets to your app (e.g. import 'katex/dist/katex.min.css').
 - Remember to import necessary Katex modules if needed (e.g. import 'katex/contrib/mhchem/mhchem').
 */

import katex from 'katex'

export function extCodeKatex(options) {
  const kopts = {...options, displayMode: true}
  return {
    code(code, infoString, escaped) {
      return katex.renderToString(code, kopts)
    }
  }
}
