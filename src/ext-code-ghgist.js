/**
 ext-code-ghgist - extension to handle ```gh-gist, embed GitHub Gist in iframe mode.

 Author: Thanh Nguyen <btnguyen2k (at) gmail (dot) com>
 Home  : https://github.com/btnguyen2k/js-mdr

 Usage:
 - MDR enables this extension by default.
 - This extension supports custom CSS class/stylesheet, remember to import relevant stylesheets.
 */

import {parseParamsFromString} from './utils.js'

const reAbsoluteUrl = /^\w+:\/\//

export function extCodeGHGist(options) {
  const gopts = {...options}
  return {
    code(code, infoString, escaped) {
      const params = typeof gopts.params_converter === 'function'
        ? gopts.params_converter(parseParamsFromString(infoString))
        : parseParamsFromString(infoString)
      const gist = params.$1 || params.gist || ''
      const url = reAbsoluteUrl.test(gist) ? `${gist}.js` : `https://gist.github.com/${gist}.js`
      const cssClass = params.class || gopts.class || ''
      const cssClassStr = cssClass ? ` class="${cssClass}"` : ''
      const cssStyle = params.style || gopts.style || ''
      const cssStyleStr = cssStyle ? ` style="${cssStyle}"` : ''
      return `<div${cssClassStr}${cssStyleStr}><iframe src="data:text/html;charset=utf-8,<head><base target='_blank' /></head><body><script src='${url}'></script></body>"></iframe></div>`
    }
  }
}
