// jest.config.js
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    globals: {
      'ts-jest': {
        isolatedModules: true,  // This makes the process faster if no types are needed
      },
    },
    testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  };
  