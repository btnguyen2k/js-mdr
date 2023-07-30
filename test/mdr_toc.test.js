import {mdr} from '../src/index.js'

describe('mdr_toc', () => {
  test('no toc_container', () => {
    const input = '# heading A\n## heading B'
    const expectedResult = '<h1>heading A</h1>\n<h2>heading B</h2>\n'
    expect(mdr(input, {headerIds: false})).toEqual(expectedResult)
  })

  test('toc_container with heading-id', () => {
    const input = '# heading A\n## heading B'
    const opts = {headerPrefix: 'h-', toc_container: []}
    mdr(input, opts)
    expect(opts.toc_container).toEqual([
      {id: 'h-heading-a', level: 1, text: 'heading A'},
      {id: 'h-heading-b', level: 2, text: 'heading B'}
    ])
  })

  test('toc_container without heading-id', () => {
    const input = '# heading A\n## heading B'
    const opts = {headerIds: false, toc_container: []}
    mdr(input, opts)
    expect(opts.toc_container).toEqual([
      {id: '', level: 1, text: 'heading A'},
      {id: '', level: 2, text: 'heading B'}
    ])
  })
})
