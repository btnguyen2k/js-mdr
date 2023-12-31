/**
 Custom renderer for marked.

 Author: Thanh Nguyen <btnguyen2k (at) gmail (dot) com>
 Home  : https://github.com/btnguyen2k/js-mdr
 */
import {marked} from 'marked'
import GithubSlugger from 'github-slugger'

export class MdrRenderer extends marked.Renderer {
  constructor(opts) {
    opts = typeof opts === 'object' && opts != null ? opts : {}
    let slugger = null
    let headerPrefix = ''
    if (opts.headerIds || opts.headerPrefix) {
      headerPrefix = typeof opts.headerPrefix === 'string' ? opts.headerPrefix : ''
      slugger = new GithubSlugger()
      opts.headerIds = false
      delete opts.headerPrefix
    }
    super(opts)
    this.slugger = slugger
    this.headerPrefix = headerPrefix
  }

  heading(text, level, raw, slugger) {
    if (this.slugger) {
      const id = this.headerPrefix + this.slugger.slug(raw)
      if (this.tocContainer) {
        this.tocContainer.push({id, level, text})
      }
      return `<h${level} id="${id}">${text}</h${level}>\n`
    }
    if (this.tocContainer) {
      this.tocContainer.push({id: '', level, text})
    }
    return `<h${level}>${text}</h${level}>\n`
  }
}
