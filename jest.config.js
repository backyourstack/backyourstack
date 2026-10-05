const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: __dirname });

module.exports = createJestConfig({
  coverageDirectory: './coverage/',
  collectCoverage: true,
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/node_modules/', '/test/files/'],
});
