import * as assert from 'assert';
import {mdr} from '../../src/index.js';

const md = "this is a _simple_ **Markdown** text"
console.log(mdr(md))
