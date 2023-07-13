/**
 Custom renderer for marked.

 Author: Thanh Nguyen <btnguyen2k (at) gmail (dot) com>
 Home  : https://github.com/btnguyen2k/mdr
 */
import {marked} from 'marked'
import GithubSlugger from 'github-slugger'

export class MdrRenderer extends marked.Renderer {
  toc = []
  slugger
  headerPrefix

  constructor(options) {
    let slugger = null
    let headerPrefix = ''
    if (options.headerIds || options.headerPrefix) {
      headerPrefix = typeof options.headerPrefix === 'string' ? options.headerPrefix : ''
      slugger = new GithubSlugger()
      options.headerIds = false
      delete options.headerPrefix
    }
    super(options)
    this.slugger = slugger
    this.headerPrefix = headerPrefix
  }

  // code(code, infostring, escaped) {
  //   const lang = (infostring || '').match(/\S*/)[0];
  //   if (this.options.highlight) {
  //     const out = this.options.highlight(code, lang);
  //     if (out != null && out !== code) {
  //       escaped = true;
  //       code = out;
  //     }
  //   }
  //
  //   code = code.replace(/\n$/, '') + '\n';
  //
  //   if (!lang) {
  //     return '<pre><code>'
  //       + (escaped ? code : escape(code, true))
  //       + '</code></pre>\n';
  //   }
  //
  //   return '<pre><code class="'
  //     + this.options.langPrefix
  //     + escape(lang)
  //     + '">'
  //     + (escaped ? code : escape(code, true))
  //     + '</code></pre>\n';
  // }

  heading(text, level, raw, slugger) {
    if (this.slugger) {
      const id = this.headerPrefix + this.slugger.slug(raw)
      this.toc.push({id, level, text})
      return `<h${level} id="${id}">${text}</h${level}>\n`
    }
    return `<h${level}>${text}</h${level}>\n`
  }
}
