/**
 Utility functions.

 Author: Thanh Nguyen <btnguyen2k (at) gmail (dot) com>
 Home  : https://github.com/btnguyen2k/js-mdr
 */

export function escapeHtml(html) {
  return html.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/`/g, '&#96;')
}

const reParamToken = /^\s*(([\w-\.]+)\s*=\s*(\S+|"[^"]+"|'[^']+'|`[^`]+`))|([^\s='"`]+|"[^"]+"|'[^']+'|`[^`]+`)/s

/**
 * Parse parameters from a string.
 * @param {string} paramsStr the input parameter string, format: `value1 param2=value2 value3 value4 param5=value5 ...`.
 * @returns {object} the parsed result as an object, please note that parameter names are converted to lower-case. If the
 * N-th part does not have a parameter name, the parameter name is assigned to `$N` (note that N is 0-based!).
 */
export function parseParamsFromString(paramsStr) {
  const result = {}
  paramsStr = paramsStr || ''
  let index = 0
  while (paramsStr.trim() !== '') {
    const matches = paramsStr.trim().match(reParamToken)
    if (!matches) {
      console.error(`[ERROR] parseParamsFromString - invalid token at <${paramsStr}>`)
      break
    }
    if (matches[1]) {
      const key = matches[2]
      const value = matches[3].startsWith('"') || matches[3].startsWith("'") || matches[3].startsWith('`')
        ? matches[3].substring(1, matches[3].length - 1).trim()
        : matches[3]
      result[key.toLowerCase()] = value
    } else {
      const key = '$' + index
      const value = matches[4].startsWith('"') || matches[4].startsWith("'") || matches[4].startsWith('`')
        ? matches[4].substring(1, matches[4].length - 1).trim()
        : matches[4]
      result[key] = value
    }
    paramsStr = paramsStr.trim().substring(matches[0].length)
    index++
  }
  return result
}
