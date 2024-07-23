/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  clearMocks: true,
  rootDir: '.',
  testRegex: ['.*\\..*spec\\.ts$'],
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  collectCoverageFrom: [
    '**/*.(t|j)s',
    '!**/*module.ts',
    '!**/prisma/**',
    '!apps/**/providers/**',
    '!**/main.ts',
    '!**/config.ts',
  ],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  roots: ['<rootDir>/apps/', '<rootDir>/libs/'],
};
