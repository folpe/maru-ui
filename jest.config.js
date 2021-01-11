module.exports = {
  collectCoverageFrom: ['src/**/*.js'],
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': '<rootDir>/jest/dummy.js',
  },
  notify: true,
  roots: ['<rootDir>/src/'],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
    ['jest-watch-toggle-config', { setting: 'verbose' }],
    ['jest-watch-toggle-config', { setting: 'collectCoverage' }],
  ],
}
