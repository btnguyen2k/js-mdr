import {mdr} from '../src/index.js'
import {JSDOM} from 'jsdom'
import {compare} from 'dom-compare'

const testCases = [
  {
    input: '```video https://domain/folder/video.mp4\n```',
    expectedResult: '<video controls="true"><source src="https://domain/folder/video.mp4"></video>',
    description: 'Direct link to video, with default options',
  },
  {
    input: '```video url="folder/video.mp4"\n```',
    expectedResult: '<video controls="true"><source src="folder/video.mp4"></video>',
    description: 'relative link, default options',
  },
  {
    input: '```video video.mp4 class="my-custom-class"\n```',
    expectedResult: '<video controls="true" class="my-custom-class"><source src="video.mp4"></video>',
    description: 'custom CSS class',
    compareDOM: true,
  },
  {
    input: '```video video.mp4 style="my-custom-style"\n```',
    expectedResult: '<video controls="true" style="my-custom-style"><source src="video.mp4"></video>',
    description: 'custom CSS style',
    compareDOM: true,
  },
  {
    input: '```video video.mp4 class="my-custom-class" ratio="16x9"\n```',
    expectedResult: '<video controls="true" class="mb-4 ratio ratio-16x9"><source src="video.mp4"></video>',
    description: 'with params_converter',
    compareDOM: true,
    opts: {
      video_opts: {
        params_converter: (params) => {
          if (params.ratio) {
            params.class = `mb-4 ratio ratio-${params.ratio}`
          }
          return params
        }
      }
    }
  },
  {
    input: '```video /folder/video.mp4\n```',
    expectedResult: '<video controls="true"><source src="/folder/video.mp4"></video>',
    description: 'root link',
  },
  {
    input: '```video invalid://file.mp4\n```',
    expectedResult: '<video controls="true"><source src="https://placehold.co/600x400/red/yellow.mp4?text=Invalid%20media%20url"></video>',
    description: 'invalid link',
  },
  {
    input: '```video url=""\n```',
    expectedResult: '<video controls="true"><source src="https://placehold.co/600x400/red/yellow.mp4?text=Invalid%20media%20url"></video>',
    description: 'empty link',
  },
  {
    input: '```video "https://www.youtube.com/watch?v=_uFMhbbHa24"\n```',
    expectedResult: '<div><iframe src="https://www.youtube.com/embed/_uFMhbbHa24" allow="fullscreen; accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe></div>',
    description: 'Youtube video',
    compareDOM: true,
  },
  {
    input: '```video url="https://www.youtube.com/embed/_uFMhbbHa24"\n```',
    expectedResult: '<div><iframe src="https://www.youtube.com/embed/_uFMhbbHa24" allow="fullscreen; accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe></div>',
    description: 'Embedded Youtube video',
    compareDOM: true,
  },
  {
    input: '```video "https://www.youtube.com/watch?v=_uFMhbbHa24&t=939s"\n```',
    expectedResult: '<div><iframe src="https://www.youtube.com/embed/_uFMhbbHa24?start=939s" allow="fullscreen; accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe></div>',
    description: 'Youtube video with start time',
    compareDOM: true,
  },
  {
    input: '```video url="https://www.youtube.com/embed/_uFMhbbHa24?start=939s"\n```',
    expectedResult: '<div><iframe src="https://www.youtube.com/embed/_uFMhbbHa24?start=939s" allow="fullscreen; accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe></div>',
    description: 'Embedded Youtube video with start time',
    compareDOM: true,
  },
  {
    input: '```video url="https://www.youtube.com/invalid"\n```',
    expectedResult: '<div><iframe src="https://www.youtube.com/embed/" allow="fullscreen; accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe></div>',
    description: 'Invalid embedded Youtube video',
    compareDOM: true,
  },
]

describe('mdr_video', () => {
  testCases.forEach((tc) => {
    it(tc.description, () => {
      const output = mdr(tc.input, tc.opts)
      if (tc.compareDOM) {
        const window = new JSDOM().window
        const outputNode = new window.DOMParser().parseFromString(output, 'text/html')
        const expectedNode = new window.DOMParser().parseFromString(tc.expectedResult, 'text/html')
        const result = compare(outputNode, expectedNode)
        if (!result.getResult()) {
          console.log('Input   :', tc.input)
          console.log('Expected:', tc.expectedResult)
          console.log('Received:', output)
        }
        expect(result.getResult()).toBe(true)
      } else {
        expect(output).toEqual(tc.expectedResult)
      }
    })
  })
})
