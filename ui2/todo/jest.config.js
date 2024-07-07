module.exports = {
  preset: 'jest-preset-angular/setup-jest',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.js'], 
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|mjs|js|html)$': 'jest-preset-angular',
  },
  transformIgnorePatterns: [
    'node_modules/(?!.*\\.mjs$)'
  ],
};
