export default {
  restoreMocks: true,
  clearMocks: true,
  // collectCoverage: true,
  collectCoverageFrom: [
    './src/**'
  ],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 90,
      statements: 90
    }
  },
  testRegex: /\.test\.jsx?$/.source,
  transform: {
    '\\.[jt]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!'
    + [
      'github-slugger',
      'katex',
      'mermaid',
      'ts-dedent',
    ].join('|')
    + ')',
  ]
}
