import {mdr} from '../../src/index.js'

const testCases = [
  {input: 'This is Katex: $x^2 + y^2 = z^2$ and this is not: $x^2 + y^2 = z^2'},
  {input: 'This is multi-Katex case: $x^2$ + $y^2$ = $z^2$ and this is not: $x^2 + y^2 = z^2'},
  {input: '$\\ce{2H2 + O2 -> H2O}$'},
  {input: 'This is not Katex \\$a = b + c$'},
  {input: 'This is also not Katex $$\na= b + c\n$$'},
]

// const inlineStartRule = /(\s|^)\$([^$]+)\$/
for (const tc of testCases) {
  console.log('------------------------------------------------------------')
  console.log('INPUT: ', tc.input)
  // const inlineStartRule = /(?<=\s|^)\${1,2}(?!\$)/
  // const inlineRule = /^(\${1,2})(?!\$)((?:\\.|[^\\\n])+?)(?<!\$)\1(?=\s|$)/
  // const match = tc.input.match(inlineStartRule)
  // if (!match) {
  //   continue
  // }
  // const possibleKatex = tc.input.substring(match.index)
  // console.log('POSSIBLE KATEX: ', match.index, possibleKatex, possibleKatex.match(inlineRule))

  const html = mdr(tc.input, {safety: false})
  console.log('OUTPUT: ', html)
}
