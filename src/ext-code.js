/**
 base-url - marked extension to handle ``` block.

 Author: Thanh Nguyen <btnguyen2k (at) gmail (dot) com>
 Home  : https://github.com/btnguyen2k/mdr
 */
export function extCode(options) {
  return {
    walkTokens(token) {
      console.log('[DEBUG]', token)
    },
    renderer: {
      code(code, infoString, escaped) {
        console.log('[DEBUG] - code')
        return '--DEBUG--'
      }
    }
  }
}
