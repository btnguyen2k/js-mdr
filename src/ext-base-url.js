/**
 base-url - marked extension to handle baseUrl option.

 Author: Thanh Nguyen <btnguyen2k (at) gmail (dot) com>
 Home  : https://github.com/btnguyen2k/mdr

 Note: this extension is temporary and will be removed in the future when PR is merged with markedjs/marked-base-url!
 */

export function extBaseUrl(baseUrl) {
  const reAbsUrl = /^[\w+]+:\/\//

  // make sure baseUrl ends with one '/'
  baseUrl = baseUrl.trim().replaceAll(/[\/\.]+$/g, '') + '/'
  return {
    walkTokens(token) {
      if (!['link', 'image'].includes(token.type)) {
        // modify URL only for link and image tokens
        return
      }
      if (reAbsUrl.test(token.href)) {
        // keep the URL intact if absolute
        return
      }
      if (!reAbsUrl.test(baseUrl)) {
        // baseUrl is not absolute
        if (token.href.startsWith('/')) {
          // the URL is from root
          return
        }
        try {
          const baseUrlFromRoot = baseUrl.startsWith('/')
          const dummy = 'http://__dummy__'
          const temp = new URL(baseUrl + token.href, dummy).href
          token.href = temp.slice(dummy.length + (baseUrlFromRoot ? 0 : 1))
        } catch (e) {
          // ignore
        }
      } else {
        try {
          token.href = new URL(token.href, baseUrl).href
        } catch (e) {
          // ignore
        }
      }
    }
  }
}
