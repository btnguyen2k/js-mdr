import * as assert from 'assert';
import {mdr} from '../../src/index.js';

const md = "**Contact** _me_ at email@example.com. My website is [example.com](./relative/path)."
console.log(mdr(md, {mangle: false, baseUrl: 'https://example.com/folder/'}))
