import {parseParamsFromString} from '../src/utils.js'
import {checksum} from '@btnguyen2k/checksum'

const testCases = [
  {
    input: 'key1=value1 key2="value2"  key3=\'value3\' \t key4=`value4`',
    expectedResult: {
      key1: 'value1',
      key2: 'value2',
      key3: 'value3',
      key4: 'value4',
    },
    description: 'key=value...'
  },
  {
    input: 'value1 "value2"  \'value3\' \t `value4`',
    expectedResult: {
      $0: 'value1',
      $1: 'value2',
      $2: 'value3',
      $3: 'value4',
    },
    description: 'value...'
  },
  {
    input: 'key1=value1 "value2"  key3=\'value3\' \t `value4`',
    expectedResult: {
      key1: 'value1',
      $1: 'value2',
      key3: 'value3',
      $3: 'value4',
    },
    description: 'mixed key=value and value...'
  },
  {
    input: 'key1=value1 key2=',
    expectedResult: {
      key1: 'value1',
      $1: 'key2',
    },
    description: 'invalid token'
  },
  {
    input: '',
    expectedResult: {},
    description: 'empty input'
  }
]

describe('utils_parseParamsFromString', () => {
  testCases.forEach((tc) => {
    it(tc.description, () => {
      const output = parseParamsFromString(tc.input)
      if (checksum(output) !== checksum(tc.expectedResult)) {
        console.log('input: ', tc.input)
        console.log('output: ', output)
        console.log('expectedResult: ', tc.expectedResult)
      }
      expect(checksum(output)).toEqual(checksum(tc.expectedResult))
    })
  })
})
