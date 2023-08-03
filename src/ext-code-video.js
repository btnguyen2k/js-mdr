/**
 ext-code-video - extension to handle ```video, embed video in Markdown document.

 Author: Thanh Nguyen <btnguyen2k (at) gmail (dot) com>
 Home  : https://github.com/btnguyen2k/js-mdr

 Usage:
 - MDR enables this extension by default.
 - This extension supports custom CSS class/stylesheet, remember to import relevant stylesheets.
 */

import {parseParamsFromString} from './utils.js'

const youtubeDomains = {'www.youtube.com': true, 'youtube.com': true, 'youtu.be': true}
const allowedProtocols = {'http:': true, 'https:': true, 'ftp:': true, 'ftps:': true, 'file:': true}
const invalidMediaUrl = 'https://placehold.co/600x400/red/yellow.mp4?text=Invalid%20media%20url'

export function extCodeVideo(options) {
  const gopts = {...options}
  return {
    code(code, infoString, escaped) {
      const params = typeof gopts.params_converter === 'function'
        ? gopts.params_converter(parseParamsFromString(infoString))
        : parseParamsFromString(infoString)
      const cssClass = params.class || gopts.class || ''
      const cssClassStr = cssClass ? ` class="${cssClass}"` : ''
      const cssStyle = params.style || gopts.style || ''
      const cssStyleStr = cssStyle ? ` style="${cssStyle}"` : ''
      let videoUrl = params.$1 || params.url || ''
      try {
        if (!videoUrl) {
          throw new Error(`Invalid media url <${videoUrl}>`)
        }
        const url = new URL(videoUrl, 'http://localhost')
        if (!allowedProtocols[url.protocol]) {
          throw new Error(`Invalid media url <${videoUrl}>`)
        }
        if (youtubeDomains[url.hostname]) {
          // youtube video
          const vstart = url.searchParams.get('t') ? url.searchParams.get('t') : url.searchParams.get('start')
          let vid = url.searchParams.get('v')
          if (!vid) {
            const tokens = url.pathname.split('/')
            vid = tokens.length > 2 ? tokens[2] : ''
          }
          const vurl = `https://www.youtube.com/embed/${vid}${vstart ? '?start=' + vstart : ''}`
          return `<div${cssClassStr}${cssStyleStr}><iframe src="${vurl}" allow="fullscreen; accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe></div>`
        }
      } catch (e) {
        videoUrl = invalidMediaUrl
      }
      return `<video controls="true"${cssClassStr}${cssStyleStr}><source src="${videoUrl}" /></video>`
    }
  }
}
