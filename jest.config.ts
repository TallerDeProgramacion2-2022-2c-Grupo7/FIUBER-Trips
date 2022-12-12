import type {Config} from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  transform: {
  '^.+\\.tsx?$': 'ts-jest',
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/', 'utils.ts'],
  collectCoverage: true,
  coverageReporters: ['html'],
  coveragePathIgnorePatterns: ['<rootDir>/src/jest/*', '.mock.ts', '.idl', '<rootDir>/src/utils/storage'],
  preset: '@shelf/jest-mongodb',
  // testEnvironment: 'node'
};
export default config;