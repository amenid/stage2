module.exports = {
preset: '/home/ameni/projettt/stage2/ui2/todo/node_modules/jest-preset-angular/presets/defaults/jest-preset.js',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testEnvironment: 'jsdom', 
  transform: {
    '^.+\\.(ts|mjs|js|html)$': 'jest-preset-angular/out/config/presets/defaults/transform', 
  },
  transformIgnorePatterns: [
    'node_modules/(?!.*\\.mjs$)' 
  ],
};
