module.exports = {
  preset: 'jest-preset-angular/out/config/presets/defaults', 
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testEnvironment: 'jsdom', 
  transform: {
    '^.+\\.(ts|mjs|js|html)$': 'jest-preset-angular/out/config/presets/defaults/transform', 
  },
  transformIgnorePatterns: [
    'node_modules/(?!.*\\.mjs$)' 
  ],
};
